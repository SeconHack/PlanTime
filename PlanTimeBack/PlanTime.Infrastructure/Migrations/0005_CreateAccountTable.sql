CREATE TABLE account (
                         id SERIAL NOT NULL UNIQUE,
                         email TEXT,
                         hashed_password TEXT UNIQUE,
                         last_name TEXT,
                         first_name TEXT,
                         middle_name TEXT,
                         phone TEXT,
                         count_vacation_days INTEGER,
                         role_id INTEGER,
                         profession_id INTEGER,
                         division_id INTEGER,
                         vacation_id INTEGER NULL,
                         PRIMARY KEY(id)
);