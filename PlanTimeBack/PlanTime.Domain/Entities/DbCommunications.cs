namespace PlanTime.Domain.Entities;

public class DbCommunications
{
    /// <summary>
    /// Получает или задает идентификатор соединения подразделений.
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Получает или задает идентификатор родительского подразделения.
    /// </summary>
    public int ParentId { get; set; }
    
    /// <summary>
    /// Получает или задает идентификатор дочернего подразделения.
    /// </summary>
    public int ChildId { get; set; }
}