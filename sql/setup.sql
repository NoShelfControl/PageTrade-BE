DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS actions;

CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    user_image TEXT,
    bio VARCHAR(250),
    user_name TEXT,
    user_location TEXT
);
CREATE TABLE books (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    author TEXT,
    google_id TEXT NOT NULL,
    owner_id BIGINT NOT NULL REFERENCES users(id),
    image TEXT NOT NULL,
    is_tradeable BOOLEAN NOT NULL,
    is_watched BOOLEAN NOT NULL
);

CREATE TABLE actions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    action_type TEXT NOT NULL,
    book TEXT NOT NULL
);