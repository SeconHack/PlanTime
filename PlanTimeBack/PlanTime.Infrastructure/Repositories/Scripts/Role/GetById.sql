SELECT id                 AS Id,
       role_name          AS ProfessionName
FROM role
WHERE id = @Id;