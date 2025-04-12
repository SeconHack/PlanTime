namespace PlanTime.Application.Services.Interfaces;

public interface IReportService
{
    Task<(int,string)> SaveReportAsync(int userId);
    
}