namespace PlanTime.Domain.Entities;

/// <summary>
/// Представляет сущность периода отпуска в базе данных.
/// </summary>
public class DbVacation
{
    /// <summary>
    /// Получает или задает идентификатор периода отпуска.
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Получает или задает дату начала периода отпуска.
    /// </summary>
    public DateTime StartDate { get; set; }
    
    /// <summary>
    /// Получает или задает дату окончания периода отпуска.
    /// </summary>
    public DateTime EndDate { get; set; }
}