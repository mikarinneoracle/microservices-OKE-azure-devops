const express = require('express');
const oracledb = require('oracledb');

const app = express();
const port = 8080;

const password = process.env.ATP_PWD;
console.log('atp password:' + password);

let db_created = false; 

async function init() {
  try {
    // Create a connection pool which will later be accessed via the
    // pool cache as the 'default' pool.
    await oracledb.createPool({
      user: "admin",
      password: password,
      connectString: "localhost:1521/MYATP",
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
    console.log('init() error: ' + err.message);
  }
} 

async function create_db()
{
  let connection, sql, binds, options, result;
  try {
    console.log('Creating database schema and data ..');

    connection = await oracledb.getConnection();
    const stmts = [

      `CREATE TABLE "PRICE" 
      (	"ID" NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
      "TIER" VARCHAR2(200 BYTE), 
      "PRICE_MO" NUMBER, 
      "USERS" NUMBER, 
      "STORAGE" NUMBER, 
      "SUPPORT" VARCHAR2(1000 BYTE)
      )`,

      `CREATE UNIQUE INDEX "PRICE_PK" ON "PRICE" ("ID")`,

      `CREATE UNIQUE INDEX "PRICE_CON_TIER_UNIQUE" ON "PRICE" ("TIER")`,

      `ALTER TABLE "PRICE" MODIFY ("TIER" NOT NULL ENABLE)`,

      `ALTER TABLE "PRICE" ADD CONSTRAINT "PRICE_PK" PRIMARY KEY ("ID") USING INDEX  ENABLE`,

      `ALTER TABLE "PRICE" ADD CONSTRAINT "PRICE_CON_TIER_UNIQUE" UNIQUE ("TIER") USING INDEX  ENABLE`,

      `CREATE TABLE "OPTIONS" 
      (	"ID" NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
      "TIER" VARCHAR2(200 BYTE), 
      "ISPUBLIC" VARCHAR2(1 BYTE), 
      "ISPRIVATE" VARCHAR2(1 BYTE), 
      "ISPERMISSIONS" VARCHAR2(1 BYTE), 
      "ISSHARING" VARCHAR2(1 BYTE), 
      "ISUNLIMITED" VARCHAR2(1 BYTE), 
      "ISEXTRASEC" VARCHAR2(1 BYTE)
      )`,

      `CREATE UNIQUE INDEX "OPTIONS_PK" ON "OPTIONS" ("ID")`,

      `ALTER TABLE "OPTIONS" MODIFY ("TIER" NOT NULL ENABLE)`,

      `ALTER TABLE "OPTIONS" ADD CONSTRAINT "OPTIONS_PK" PRIMARY KEY ("ID") USING INDEX  ENABLE`,

      `ALTER TABLE "OPTIONS" ADD CONSTRAINT "OPTIONS_FK" FOREIGN KEY ("TIER") REFERENCES "PRICE" ("TIER") ENABLE`

    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch (e) {
        if (e.errorNum != 942) {
          //console.log(e);
        }
      }
    }

    sql = `INSERT INTO PRICE (TIER, PRICE_MO, USERS, STORAGE, SUPPORT) VALUES (:1, :2, :3, :4, :5)`;
    binds = [
      ['FREE', 0, 1, 10, 'Email'],
      ['PRO', 10, 15, 200, 'Priority Email'],
      ['ENTERPRISE', 150, 1000, 50000, 'Phone and Email']
    ];
    options = {
      autoCommit: true,
      batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        { type: oracledb.STRING, maxSize: 200 },
        { type: oracledb.NUMBER },
        { type: oracledb.NUMBER },
        { type: oracledb.NUMBER },
        { type: oracledb.STRING, maxSize: 1000 }
      ]
    };
    result = await connection.executeMany(sql, binds, options);
    console.log("Number of rows inserted to PRICE table:", result.rowsAffected);

    sql = `INSERT INTO OPTIONS (TIER, ISPUBLIC, ISPRIVATE, ISPERMISSIONS, ISSHARING, ISUNLIMITED, ISEXTRASEC) VALUES (:1, :2, :3, :4, :5, :6, :7)`;
    binds = [
      ['FREE', 'Y', 'N', 'Y', 'N', 'N', 'N'],
      ['PRO', 'Y', 'Y', 'Y', 'Y', 'Y', 'N'],
      ['ENTERPRISE', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y']
    ];
    options = {
      autoCommit: true,
      batchErrors: true,  // continue processing even if there are data errors
      bindDefs: [
        { type: oracledb.STRING, maxSize: 200 },
        { type: oracledb.STRING, maxSize: 2 },
        { type: oracledb.STRING, maxSize: 2 },
        { type: oracledb.STRING, maxSize: 2 },
        { type: oracledb.STRING, maxSize: 2 },
        { type: oracledb.STRING, maxSize: 2 },
        { type: oracledb.STRING, maxSize: 2 }
      ]
    };
    result = await connection.executeMany(sql, binds, options);
    console.log('Number of rows inserted OPTIONS table:', result.rowsAffected);
    db_created = true;
  } catch (err) {
    //console.log(err);
  } finally {
    if (connection) {
      console.log('Creating database schema and data done.');
      try {
        await connection.close();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

async function getOptions(tier) {
  let connection;
  try {
    // Get a connection from the default pool
    if(!db_created) { 
      await create_db();
    }
    connection = await oracledb.getConnection();
    const sql = `SELECT ispublic, isprivate, ispermissions, issharing, isunlimited, isextrasec FROM options WHERE tier = :tier`;
    const options = { outFormat: oracledb.OUT_FORMAT_OBJECT };
    const binds = {tier: tier}; 
    var result = await connection.execute(sql, binds, options);
    return result;
    // oracledb.getPool().logStatistics(); // show pool statistics.  pool.enableStatistics must be true
  } catch (err) {
    //console.log(err);
  } finally {
    if (connection) {
      try {
        // Put the connection back in the pool
        await connection.close();
      } catch (err) {
        console.log(err);
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

app.get('/options/:tier', (req, res) => {
  getOptions(req.params['tier']).then((data) => {
    if(data && data.rows)
    {
      res.send(data.rows);
    }
  });
});

app.listen(port, () => {
  init();
  console.log(`Options svc listening on port ${port}`);
});

process
  .once('SIGTERM', closePoolAndExit)
  .once('SIGINT',  closePoolAndExit);


