CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    log INT
);

CREATE TABLE items (
    ID SERIAL PRIMARY KEY,
    owner INT NOT NULL,
    name TEXT NOT NULL,
    url TEXT,
    description TEXT,
    createdBy INT,
    checked BOOL,
    checkedBy INT
);

CREATE TABLE log (
    ID SERIAL PRIMARY KEY,
    type TEXT,
    item INT,
    committer INT,
    date DATE
);
