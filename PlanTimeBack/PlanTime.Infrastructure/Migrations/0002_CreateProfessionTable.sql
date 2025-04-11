CREATE TABLE profession (
                              id SERIAL NOT NULL UNIQUE,
                              profession_name TEXT,
                              count_vacation_days INTEGER,
                              count_interchangeable INTEGER,
                              PRIMARY KEY(id)
);