INSERT INTO profession (profession_name, count_vacation_days, count_interchangeable)
VALUES (@ProfessionName, @CountVacationDays, @CountInterchangeable)
RETURNING id, profession_name, count_vacation_days, count_interchangeable;