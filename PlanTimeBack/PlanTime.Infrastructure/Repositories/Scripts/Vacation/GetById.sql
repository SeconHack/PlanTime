SELECT id                       AS Id,
       start_date               AS StartDate,
       end_date                 AS EndDate,
FROM vacation
WHERE id = @Id;