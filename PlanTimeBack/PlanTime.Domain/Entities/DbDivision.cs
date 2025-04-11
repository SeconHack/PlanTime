namespace PlanTime.Domain.Entities;

/// <summary>
/// Представляет сущность подразделения в базе данных.
/// </summary>
public class DbDivision
{
    /// <summary>
    /// Получает или задает идентификатор подразделения.
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Получает или задает названия подразделения.
    /// </summary>
    public string DivisionName { get; set; }
}