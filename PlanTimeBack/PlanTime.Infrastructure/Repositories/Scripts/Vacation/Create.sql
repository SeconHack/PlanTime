INSERT INTO vacation (start_date, end_date,user_id)
VALUES (@StartDate, @EndDate,@UserId)
RETURNING id, start_date AS StartDate, end_date AS EndDate,user_id As UserId;