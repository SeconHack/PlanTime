CREATE TABLE role (
                        id SERIAL NOT NULL UNIQUE,
                        role_name TEXT,
                        PRIMARY KEY(id)
);

INSERT INTO role (role_name)
VALUES ("Worker"),
       ("Director"),
       ("Leader");