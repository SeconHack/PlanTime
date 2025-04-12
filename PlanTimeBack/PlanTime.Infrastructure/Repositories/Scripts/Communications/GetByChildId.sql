SELECT id                       AS Id,
       parent_id               AS ParentId,
       child_id                 AS ChildId
FROM communications
WHERE child_id = @Id;