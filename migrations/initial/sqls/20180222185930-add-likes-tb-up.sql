CREATE TABLE likes
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users,
    liked_by INTEGER REFERENCES users,
    created_at TIMESTAMPTZ
);