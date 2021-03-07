DROP TABLE IF EXISTS users cascade;
DROP TABLE IF EXISTS categories cascade;
DROP TABLE IF EXISTS offers cascade;
DROP TABLE IF EXISTS comments cascade;
DROP TABLE IF EXISTS offers_categories;

CREATE TABLE users(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  email varchar(255) UNIQUE NOT NULL,
  password_hash varchar(255) NOT NULL,
  first_name varchar(255) NOT NULL,
  last_name varchar(255) NOT NULL,
  avatar varchar(50) NOT NULL
);

CREATE TABLE categories(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name varchar(255) NOT NULL
);

CREATE TABLE offers(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title varchar(255) NOT NULL,
  description text NOT NULL,
  type varchar(5) NOT NULL,
  sum integer NOT NULL,
  picture varchar(50),
  user_id integer NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE offer_categories(
  offer_id integer NOT NULL,
  category_id integer NOT NULL,
  PRIMARY KEY (offer_id, category_id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
  		ON DELETE CASCADE
		  ON UPDATE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id)
  		ON DELETE CASCADE
		  ON UPDATE CASCADE
);

CREATE TABLE comments(
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  offer_id integer NOT NULL,
  user_id integer NOT NULL,
  text text NOT NULL,
  created_at timestamp DEFAULT current_timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (offer_id) REFERENCES offers(id)
);

CREATE INDEX ON offers (title);