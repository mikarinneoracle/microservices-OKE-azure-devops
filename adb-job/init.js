const oracledb = require('oracledb');

oracledb.initOracleClient({ libDir: '/instantclient_23_3', configDir: '/instantclient_23_3/network/admin/' });

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function run() {
  let connection;

  // Let's wait for X seconds before we execute this
  let delay = process.env.AWAIT ? process.env.AWAIT : 0;
  let i = 0;
  console.log("Delaying execution " + (process.env.AWAIT ? process.env.AWAIT : 0) + " milliseconds ..");
  while(i < delay / 1000)
  {
    await sleep(1000);
    i++;
    console.log(i + " seconds ..");
  }

  const config = {
    user: "admin",
    password: process.env.ATP_PWD,
    connectString: process.env.CONNECT_STRING
  };

  console.log("atp password:" + config.password);
  console.log("atp connect string:" + config.connectString);

  try {

    let sql, binds, options, result;
    connection = await oracledb.getConnection(config);
    const stmts = [

      `TRUNCATE TABLE OPTIONS`,

      `TRUNCATE TABLE PRICE`,

      `DROP TABLE OPTIONS`,

      `DROP TABLE PRICE`,

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

      `CREATE UNIQUE INDEX "OPTIONS_CON_TIER_UNIQUE" ON "OPTIONS" ("TIER")`,

      `ALTER TABLE "OPTIONS" MODIFY ("TIER" NOT NULL ENABLE)`,

      `ALTER TABLE "OPTIONS" ADD CONSTRAINT "OPTIONS_PK" PRIMARY KEY ("ID") USING INDEX  ENABLE`,

      `ALTER TABLE "OPTIONS" ADD CONSTRAINT "OPTIONS_FK" FOREIGN KEY ("TIER") REFERENCES "PRICE" ("TIER") ENABLE`

    ];

    for (const s of stmts) {
      try {
        await connection.execute(s);
      } catch (e) {
        if (e.errorNum != 942) {
          console.log(e);
        }
      }
    }

    sql = `INSERT INTO PRICE (TIER, PRICE_MO, USERS, STORAGE, SUPPORT) VALUES (:1, :2, :3, :4, :5)`;
    binds = [
      ['FREE', 0, 1, 10, 'Email'],
      ['PRO', 10, 15, 200, 'Priority Email'],
      ['ENTERPRISE', 500, 1000, 50000, 'Phone and Email']
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
    console.log("Number of rows inserted OPTIONS table:", result.rowsAffected);

  } catch (err) {
    console.log(err);
    console.log("Exiting process due to error to restart.");
    process.exit(1); // Restart the job in case of connection error with a non-zero exit status
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.log(err);
      }
    }
  }
}

run();