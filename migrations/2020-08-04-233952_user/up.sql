CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA users;

CREATE DOMAIN users.email AS citext
  CHECK ( value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$' );


CREATE TABLE users.profile (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_name CITEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email users.email NOT NULL UNIQUE,
    picture TEXT 
);

CREATE TABLE users.profile_google (
    user_id UUID NOT NULL REFERENCES users.profile ON UPDATE CASCADE ON DELETE CASCADE UNIQUE,
    google_id TEXT NOT NULL UNIQUE,
    PRIMARY KEY (user_id, google_id)
);

-- https://github.com/voxpelli/node-connect-pg-simple/blob/master/table.sql
CREATE TABLE users.session (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE users.session ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON users.session ("expire");