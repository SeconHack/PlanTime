INSERT INTO vacation (start_date, end_date)
VALUES (@StartDate, @EndDate)
RETURNING id, start_date, end_date;