DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    user_image TEXT,
    bio VARCHAR(250),
    user_name TEXT NOT NULL,
    user_location TEXT,
    books JSONB
);