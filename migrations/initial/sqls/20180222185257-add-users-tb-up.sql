CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    password VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
);