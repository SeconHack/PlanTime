SELECT id                       AS Id,
       start_date               AS StartDate,
       end_date                 AS EndDate,
       user_id                  AS UserId
FROM vacation
WHERE id = @Id;