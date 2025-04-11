UPDATE account
SET email = @Email,
    hashed_password = @HashedPassword,
    last_name = @LastName,
    first_name = @FirstName,
    middle_name = @MiddleName,
    phone = @Phone,
    count_vacation_days = @CountVacationDays,
    profession_id = @ProfessionId,
    role_id = @RoleId,
    division_id = @DivisionId,
    vacation_id = @VacationId
WHERE id = @Id;