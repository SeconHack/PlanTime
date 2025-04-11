INSERT INTO profession (profession_name, count_vacation_days, count_interchangeable)
VALUES (@ProfessionName, @CountVacationDays, @CountInterchangeable)
RETURNING id, profession_name AS ProfessionName, count_vacation_days AS CountVacationDays, count_interchangeable AS CountInterchangeable;