namespace PlanTime.Models.Vacations;

public class CreateVacationRequest
{
    /// <summary>
    /// Дата начала периода отпуска.
    /// </summary>
    public DateTime StartDate { get; set; }
    
    /// <summary>
    /// Дата окончания периода отпуска.
    /// </summary>
    public DateTime EndDate { get; set; }
}