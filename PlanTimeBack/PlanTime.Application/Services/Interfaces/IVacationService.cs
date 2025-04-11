using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services.Interfaces;

public interface IVacationService
{
    Task<List<VacationInfo>> GetAllVacationInfoAsync();
}
