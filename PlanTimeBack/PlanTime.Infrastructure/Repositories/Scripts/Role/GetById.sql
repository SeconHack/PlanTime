SELECT id                 AS Id,
       role_name          AS RoleName
FROM role
WHERE id = @Id;