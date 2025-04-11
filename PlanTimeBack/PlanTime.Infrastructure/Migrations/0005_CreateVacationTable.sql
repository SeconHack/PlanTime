CREATE TABLE vacation (
                          id SERIAL NOT NULL UNIQUE,
                          start_date DATE,
                          end_date DATE,
                          user_id INTEGER,
                          PRIMARY KEY(id)
);