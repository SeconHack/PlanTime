using PlanTime.Domain.Entities;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services.Interfaces;

public interface IVacationService
{
    Task<List<VacationInfo>> GetVacationInfoByDivisionIdAsync(int userId);
    Task<DbVacation> Create(int UserId, CreateVacationRequest model);
    Task<List<DbVacation>> GetAll();
    Task<List<DbVacation>> GetById( int id );
}
