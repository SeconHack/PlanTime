CREATE TABLE communications (
                          id SERIAL NOT NULL UNIQUE,
                          parent_id INTEGER,
                          child_id INTEGER,
                          PRIMARY KEY(id)
);