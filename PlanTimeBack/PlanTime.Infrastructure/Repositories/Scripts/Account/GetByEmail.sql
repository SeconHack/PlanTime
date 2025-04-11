SELECT id                   AS Id,
       email                AS Email,
       hashed_password      AS HashedPassword,
       last_name            AS LastName,
       first_name           AS FirstName,
       middle_name          AS MiddleName,
       phone                AS Phone,
       count_vacation_days  AS CountVacationDays,
       profession_id        AS ProfessionId,
       role_id              AS RoleId,
       division_id          AS DivisionId
FROM account
WHERE email = @Email;