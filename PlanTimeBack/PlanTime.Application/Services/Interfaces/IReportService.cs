using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services.Interfaces;

public interface IReportService
{
    Task<(int,string)> SaveReportAsync(int userId);
    Task<List<List<VacationInfo>>> GetIntersectionsAsync(int userId);
}