CREATE TABLE account (
                         id SERIAL PRIMARY KEY,
                         email TEXT NOT NULL UNIQUE,
                         hashed_password TEXT NOT NULL,
                         last_name TEXT NOT NULL,
                         first_name TEXT NOT NULL,
                         middle_name TEXT,
                         phone TEXT NOT NULL,
                         profession_id INT NOT NULL,
                         role_id INT NOT NULL,

                         CONSTRAINT fk_account_profession FOREIGN KEY (profession_id) REFERENCES profession(id),
                         CONSTRAINT fk_account_role FOREIGN KEY (role_id) REFERENCES role(id)
);