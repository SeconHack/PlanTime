namespace PlanTime.Domain.Entities;

/// <summary>
/// Представляет сущность профессий учетной записи в базе данных.
/// </summary>
public class DbProfession
{
    /// <summary>
    /// Получает или задает идентификатор учетной записи.
    /// </summary>
    public int Id { get; set; }
    
    /// <summary>
    /// Получает или задает название профессии учетной записи.
    /// </summary>
    public string ProfessionName { get; set; }
    
    /// <summary>
    /// Количество дней отпуска.
    /// </summary>
    public int CountVacationDays { get; set; } = 28;
    
    /// <summary>
    /// Сколько сотрудников данной должности должно оставаться работать.
    /// </summary>
    public int CountInterchangeable  { get; set; }
}