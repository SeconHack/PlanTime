namespace PlanTime.Domain.Entities;

/// <summary>
/// Представляет сущность ролей учетной записи в базе данных.
/// </summary>
public class DbRole
{
    /// <summary>
    /// Получает или задает идентификатор учетной записи.
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Получает или задает роль учетной записи.
    /// </summary>
    public string RoleName { get; set; }
}