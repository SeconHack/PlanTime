SELECT id                       AS Id,
       start_date               AS StartDate,
       end_date                 AS EndDate,
       user_id      As UserId
FROM vacation
WHERE id = @Id;