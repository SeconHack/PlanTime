INSERT INTO division (division_name)
VALUES (@DivisionName)
    RETURNING id, division_name AS DivisionName;