SELECT a.last_name,
       d.division_name AS DivisionName,
       v.start_date    AS VacationStartDate,
       v.end_date      AS VacationEndDate
FROM account a
         JOIN division d ON a.division_id = d.id
         JOIN vacation v ON v.id = ANY (a.vacation_id)
