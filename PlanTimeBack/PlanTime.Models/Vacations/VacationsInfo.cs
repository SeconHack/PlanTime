namespace PlanTime.Models.Vacations;

public class VacationInfo
{
    public int UserId { get; set; }
    public string LastName { get; set; }
    public string DivisionName { get; set; }
    public DateTime VacationStartDate { get; set; }
    public DateTime VacationEndDate { get; set; }

    public VacationInfo(int userid, string lastName, string divisionName,DateTime startDate, DateTime endDate)
    {
        UserId = userid;
        LastName = lastName;
        DivisionName = divisionName;
        VacationStartDate = startDate;
        VacationEndDate = endDate;
    }
}