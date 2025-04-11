INSERT INTO vacation (start_date, end_date)
VALUES (@StartDate, @EndDate)
RETURNING id, start_date AS StartDate, end_date AS EndDate;