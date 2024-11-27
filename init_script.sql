CREATE TABLE "ADMIN"."PRICE" 
   (	"ID" NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 21 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
	"TIER" VARCHAR2(200 BYTE) COLLATE "USING_NLS_COMP", 
	"PRICE_MO" NUMBER, 
	"USERS" NUMBER, 
	"STORAGE" NUMBER, 
	"SUPPORT" VARCHAR2(1000 BYTE) COLLATE "USING_NLS_COMP"
   )  DEFAULT COLLATION "USING_NLS_COMP" ;

CREATE UNIQUE INDEX "ADMIN"."PRICE_PK" ON "ADMIN"."PRICE" ("ID") 
  ;

CREATE UNIQUE INDEX "ADMIN"."PRICE_CON_TIER_UNIQUE" ON "ADMIN"."PRICE" ("TIER") 
  ;

ALTER TABLE "ADMIN"."PRICE" MODIFY ("ID" NOT NULL ENABLE);

ALTER TABLE "ADMIN"."PRICE" MODIFY ("TIER" NOT NULL ENABLE);

ALTER TABLE "ADMIN"."PRICE" ADD CONSTRAINT "PRICE_PK" PRIMARY KEY ("ID")
  USING INDEX  ENABLE;

ALTER TABLE "ADMIN"."PRICE" ADD CONSTRAINT "PRICE_CON_TIER_UNIQUE" UNIQUE ("TIER")
  USING INDEX  ENABLE;

REATE TABLE "ADMIN"."OPTIONS" 
   (	"ID" NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 41 CACHE 20 NOORDER  NOCYCLE  NOKEEP  NOSCALE , 
	"TIER" VARCHAR2(200 BYTE) COLLATE "USING_NLS_COMP", 
	"ISPUBLIC" VARCHAR2(1 BYTE) COLLATE "USING_NLS_COMP", 
	"ISPRIVATE" VARCHAR2(1 BYTE) COLLATE "USING_NLS_COMP", 
	"ISPERMISSIONS" VARCHAR2(1 BYTE) COLLATE "USING_NLS_COMP", 
	"ISSHARING" VARCHAR2(1 BYTE) COLLATE "USING_NLS_COMP", 
	"ISUNLIMITED" VARCHAR2(1 BYTE) COLLATE "USING_NLS_COMP", 
	"ISEXTRASEC" VARCHAR2(1 BYTE) COLLATE "USING_NLS_COMP"
   )  DEFAULT COLLATION "USING_NLS_COMP" ;

CREATE UNIQUE INDEX "ADMIN"."OPTIONS_PK" ON "ADMIN"."OPTIONS" ("ID") 
  ;

ALTER TABLE "ADMIN"."OPTIONS" MODIFY ("ID" NOT NULL ENABLE);

ALTER TABLE "ADMIN"."OPTIONS" MODIFY ("TIER" NOT NULL ENABLE);

ALTER TABLE "ADMIN"."OPTIONS" ADD CONSTRAINT "OPTIONS_PK" PRIMARY KEY ("ID")
  USING INDEX  ENABLE;

ALTER TABLE "ADMIN"."OPTIONS" ADD CONSTRAINT "OPTIONS_FK" FOREIGN KEY ("TIER")
	  REFERENCES "ADMIN"."PRICE" ("TIER") ENABLE;