const express = require('express');
const oracledb = require('oracledb');

const app = express();
const port = 8080;

async function init() {
  try {
    // Create a connection pool which will later be accessed via the
    // pool cache as the 'default' pool.
    await oracledb.createPool({
      user: "nodeapp",
      password: "WelcomeFolks123##",
      connectString: "localhost/XE",
      // edition: 'ORA$BASE', // used for Edition Based Redefintion
      // events: false, // whether to handle Oracle Database FAN and RLB events or support CQN
      // externalAuth: false, // whether connections should be established using External Authentication
      // homogeneous: true, // all connections in the pool have the same credentials
      // poolAlias: 'default', // set an alias to allow access to the pool via a name.
      // poolIncrement: 1, // only grow the pool by one connection at a time
      // poolMax: 4, // maximum size of the pool. (Note: Increase UV_THREADPOOL_SIZE if you increase poolMax in Thick mode)
      // poolMin: 0, // start with no connections; let the pool shrink completely
      // poolPingInterval: 60, // check aliveness of connection if idle in the pool for 60 seconds
      // poolTimeout: 60, // terminate connections that are idle in the pool for 60 seconds
      // queueMax: 500, // don't allow more than 500 unsatisfied getConnection() calls in the pool queue
      // queueTimeout: 60000, // terminate getConnection() calls queued for longer than 60000 milliseconds
      // sessionCallback: myFunction, // function invoked for brand new connections or by a connection tag mismatch
      // sodaMetaDataCache: false, // Set true to improve SODA collection access performance
      // stmtCacheSize: 30, // number of statements that are cached in the statement cache of each connection
      // enableStatistics: false // record pool usage for oracledb.getPool().getStatistics() and logStatistics()
    });
    console.log('Connection pool started');
  } catch (err) {
    console.error('init() error: ' + err.message);
  }
}

async function getPrice(tier) {
  let connection;
  try {
    // Get a connection from the default pool
    connection = await oracledb.getConnection();
    const sql = `SELECT price_mo, users, storage, support FROM price WHERE tier = :tier`;
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const binds = {tier: tier}; 
    var result = await connection.execute(sql, binds, options);
    return result;
    // oracledb.getPool().logStatistics(); // show pool statistics.  pool.enableStatistics must be true
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Put the connection back in the pool
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}  

async function getOptions(tier) {
  let connection;
  try {
    // Get a connection from the default pool
    connection = await oracledb.getConnection();
    const sql = `SELECT ispublic, isprivate, ispermissions, issharing, isunlimited, isextrasec FROM options WHERE tier = :tier`;
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const binds = {tier: tier}; 
    var result = await connection.execute(sql, binds, options);
    return result;
    // oracledb.getPool().logStatistics(); // show pool statistics.  pool.enableStatistics must be true
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        // Put the connection back in the pool
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function closePoolAndExit() {
  console.log('\nTerminating');
  try {
    // Get the pool from the pool cache and close it when no
    // connections are in use, or force it closed after 10 seconds.
    // If this hangs, you may need DISABLE_OOB=ON in a sqlnet.ora file.
    // This setting should not be needed if both Oracle Client and Oracle
    // Database are 19c (or later).
    await oracledb.getPool().close(10);
    console.log('Pool closed');
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

app.get('/price/:tier', (req, res) => {
  getPrice(req.params['tier']).then((data) => {
     res.send(data.rows);
  });
});

app.get('/options/:tier', (req, res) => {
  getOptions(req.params['tier']).then((data) => {
     res.send(data.rows);
  });
});

app.listen(port, () => {
  init();
  console.log(`Example app listening on port ${port}`);
});

app.use(express.static(__dirname + '/public'));

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);


