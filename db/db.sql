DROP DATABASE IF EXISTS articles_n_products;
DROP USER IF EXISTS art_n_prod_user;

CREATE USER art_n_prod_user;

CREATE DATABASE articles_n_products;
ALTER DATABASE articles_n_products OWNER TO art_n_prod_user;



\c articles_n_products;


DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
id serial PRIMARY KEY NOT NULL,
name character varying(90) NOT NULL,
price integer NOT NULL,
inventory integer NOT NULL);

CREATE TABLE authors (
id serial PRIMARY KEY NOT NULL,
first_name character varying (90) NOT NULL,
last_name character varying (90) NOT NULL
);

CREATE TABLE articles (
id serial PRIMARY KEY NOT NULL,
title character varying(125) NOT NULL,
body text NOT NULL,
urltitle character varying(125) NOT NULL,
author_id integer REFERENCES authors(id));

INSERT INTO products(name, price, inventory)
VALUES ('gum', 2.00, 300);

INSERT INTO products(name, price, inventory)
VALUES ('deodorant', 5.00, 200);

INSERT INTO products(name, price, inventory)
VALUES ('toys', 6.00, 300);

INSERT INTO products(name, price, inventory)
VALUES ('stuffed animal', 12.00, 200);

INSERT INTO products(name, price, inventory)
VALUES ('hairspray', 7.75, 100);


INSERT INTO authors (first_name, last_name)
VALUES ('Art', 'Kirkland');

INSERT INTO authors (first_name, last_name)
VALUES ('Peter', 'Andrews');

INSERT INTO authors (first_name, last_name)
VALUES ('Big', 'Poopeypants');

INSERT INTO articles (title, body, urltitle, author_id)
VALUES ('Telepathy Made Easy', 'I can do telepathy.  You can too!  The end.', 'www.what.com', 2);

INSERT INTO articles (title, body, urltitle, author_id)
VALUES ('Golf Made Easy', 'I can do golf.  You can too!  The end.', 'www.what.com', 2);

INSERT INTO articles (title, body, urltitle, author_id)
VALUES ('Golf is really hard', 'No one can do golf!  No matter what you hear!  The end.', 'www.where.com', 1);

INSERT INTO articles (title, body, urltitle, author_id)
VALUES ('Telepathy is really impossible', 'No one can do it!  No matter what you hear!  The end.', 'www.where.com', 1);

INSERT INTO articles (title, body, urltitle, author_id)
VALUES ('I am an expert in...nothing', 'I have no idea what the hell I am talking about.  Buy my book anyway!  The end.', 'www.when.com', 3);

SELECT * FROM articles;

UPDATE products
SET inventory = 500
WHERE name = 'hairspray';


DELETE
FROM products
WHERE name = 'toys';

SELECT * FROM products;