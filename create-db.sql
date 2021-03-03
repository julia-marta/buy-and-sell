DROP DATABASE IF EXISTS buy_and_sell;

CREATE DATABASE buy_and_sell
  WITH
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'C'
  LC_CTYPE = 'C'
  TABLESPACE = pg_default
  TEMPLATE = template0
  CONNECTION LIMIT = -1;