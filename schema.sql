--
-- File generated with SQLiteStudio v3.3.3 on Fri Jul 9 12:22:34 2021
--
-- Text encoding used: UTF-8
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: transactions
CREATE TABLE transactions (ID INTEGER PRIMARY KEY, date DATE, categorytype VARCHAR (100), categoryname VARCHAR (200), note TEXT, amount DECIMAL (8, 2), fromacc INTEGER (1), toacc INTEGER (1), deleted INTEGER (1) DEFAULT (0));

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
