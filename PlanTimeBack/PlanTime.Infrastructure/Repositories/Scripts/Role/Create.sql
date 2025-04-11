INSERT INTO role (role_name)
VALUES (@RoleName)
RETURNING id, role_name AS RoleName;