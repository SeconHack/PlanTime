UPDATE account
SET email = @Email,
    hashed_password = @HashedPassword,
    last_name = @LastName,
    first_name = @FirstName,
    middle_name = @MiddleName,
    phone = @Phone,
    profession_id = @ProfessionId,
    role_id = @RoleId
WHERE id = @Id;