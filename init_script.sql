ALTER SESSION SET "_ORACLE_SCRIPT"=true;

CREATE USER nodeapp IDENTIFIED BY WelcomeFolks123##;

GRANT CONNECT, RESOURCE, DBA TO nodeapp;

GRANT CREATE SESSION TO nodeapp;

GRANT UNLIMITED TABLESPACE TO nodeapp;

commit;

CONN nodeapp/WelcomeFolks123##;

CREATE TABLE "PRICE" 
   (	"ID" NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
	"TIER" VARCHAR2(200 BYTE), 
	"PRICE_MO" NUMBER, 
	"USERS" NUMBER, 
	"STORAGE" NUMBER, 
	"SUPPORT" VARCHAR2(1000 BYTE)
   );

CREATE UNIQUE INDEX "PRICE_PK" ON "PRICE" ("ID");

CREATE UNIQUE INDEX "PRICE_CON_TIER_UNIQUE" ON "PRICE" ("TIER");

ALTER TABLE "PRICE" MODIFY ("TIER" NOT NULL ENABLE);

ALTER TABLE "PRICE" ADD CONSTRAINT "PRICE_PK" PRIMARY KEY ("ID") USING INDEX  ENABLE;

ALTER TABLE "PRICE" ADD CONSTRAINT "PRICE_CON_TIER_UNIQUE" UNIQUE ("TIER") USING INDEX  ENABLE;

CREATE TABLE "OPTIONS" 
   (	"ID" NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
	"TIER" VARCHAR2(200 BYTE), 
	"ISPUBLIC" VARCHAR2(1 BYTE), 
	"ISPRIVATE" VARCHAR2(1 BYTE), 
	"ISPERMISSIONS" VARCHAR2(1 BYTE), 
	"ISSHARING" VARCHAR2(1 BYTE), 
	"ISUNLIMITED" VARCHAR2(1 BYTE), 
	"ISEXTRASEC" VARCHAR2(1 BYTE)
   );

CREATE UNIQUE INDEX "OPTIONS_PK" ON "OPTIONS" ("ID");

ALTER TABLE "OPTIONS" MODIFY ("TIER" NOT NULL ENABLE);

ALTER TABLE "OPTIONS" ADD CONSTRAINT "OPTIONS_PK" PRIMARY KEY ("ID") USING INDEX  ENABLE;

ALTER TABLE "OPTIONS" ADD CONSTRAINT "OPTIONS_FK" FOREIGN KEY ("TIER") REFERENCES "PRICE" ("TIER") ENABLE;

INSERT INTO PRICE (TIER, PRICE_MO, USERS, STORAGE, SUPPORT) VALUES ('FREE', 0, 1, 10, 'Email');
INSERT INTO PRICE (TIER, PRICE_MO, USERS, STORAGE, SUPPORT) VALUES ('PRO', 10, 15, 200, 'Priority Email');
INSERT INTO PRICE (TIER, PRICE_MO, USERS, STORAGE, SUPPORT) VALUES ('ENTERPRISE', 200, 100, 50000, 'Phone and Email');

SELECT tier, price_mo, users, storage, support FROM price;

commit;
