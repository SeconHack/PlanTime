CREATE TABLE account (
                         id SERIAL NOT NULL UNIQUE,
                         email TEXT,
                         hashed_password TEXT UNIQUE,
                         last_name TEXT,
                         first_name TEXT,
                         middle_name TEXT,
                         phone TEXT,
                         count_vacation_days INTEGER,
                         role_id SERIAL,
                         profession_id SERIAL,
                         division_id SERIAL,
                         vacation_id SERIAL,
                         PRIMARY KEY(id)
);

ALTER TABLE account
    ADD FOREIGN KEY(role_id) REFERENCES role(id)
        ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE account
    ADD FOREIGN KEY(profession_id) REFERENCES profession(id)
        ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE account
    ADD FOREIGN KEY(division_id) REFERENCES division(id)
        ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE account
    ADD FOREIGN KEY(vacation_id) REFERENCES vacation(id)
        ON UPDATE NO ACTION ON DELETE NO ACTION;