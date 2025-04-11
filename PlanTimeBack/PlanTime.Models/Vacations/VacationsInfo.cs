namespace PlanTime.Models.Vacations;

public class VacationInfo
{
    public string LastName { get; set; }
    public string DivisionName { get; set; }
    public DateTime VacationStartDate { get; set; }
    public DateTime VacationEndDate { get; set; }

    public VacationInfo(string lastName, string divisionName,DateTime startDate, DateTime endDate)
    {
        LastName = lastName;
        DivisionName = divisionName;
        VacationStartDate = startDate;
        VacationEndDate = endDate;
    }
}