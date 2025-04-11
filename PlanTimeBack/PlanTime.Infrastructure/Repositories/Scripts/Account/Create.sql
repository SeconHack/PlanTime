INSERT INTO account (email, hashed_password, last_name, first_name, middle_name, phone, profwssion_id, role_id)
VALUES (@Email, @HashedPassword, @LastName, @FirstName, @MiddleName, @Phone, @ProfessionId, @RoleId)
RETURNING id, email, hashed_password, last_name, first_name, middle_name, phone, profession_id, role_id;