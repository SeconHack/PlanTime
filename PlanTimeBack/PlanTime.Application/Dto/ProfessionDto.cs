namespace PlanTime.Application.Dto;

public class ProfessionDto
{
    /// <summary>
    /// Название профессии учетной записи.
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