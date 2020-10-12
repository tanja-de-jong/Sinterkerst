CREATE TABLE accounts (
    ID SERIAL PRIMARY KEY,
    name TEXT,
    iban TEXT NOT NULL,
    factor REAL,
    updated DATE
);

CREATE TABLE transactions (
    ID SERIAL PRIMARY KEY,
    date DATE,
    description TEXT,
    account INT NOT NULL,
    otherAccount TEXT,
    code CHAR(2),
    amount REAL,
    mutation TEXT,
    remarks TEXT,
    category INT,
    type TEXT
);

CREATE TABLE categories (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    parent INT
);

CREATE TABLE rules (
    ID SERIAL PRIMARY KEY,
    name TEXT,
    category INT,
    type TEXT
);

CREATE TABLE comparisons (
    ID SERIAL PRIMARY KEY,
    field TEXT,
    type TEXT,
    text TEXT,
    rule INT
);