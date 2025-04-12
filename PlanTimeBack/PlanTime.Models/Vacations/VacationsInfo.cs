namespace PlanTime.Models.Vacations;

public class VacationInfo
{
    public int UserId { get; set; }
    public int VacationId { get; set; }
    public string Email { get; set; }
    public string DivisionName { get; set; }
    public DateTime VacationStartDate { get; set; }
    public DateTime VacationEndDate { get; set; }

    public VacationInfo(int userid, int vacationId,string email, string divisionName,DateTime startDate, DateTime endDate)
    {
        UserId = userid;
        VacationId = vacationId;
        Email = email;
        DivisionName = divisionName;
        VacationStartDate = startDate;
        VacationEndDate = endDate;
    }
}