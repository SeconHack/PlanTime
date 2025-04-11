using PlanTime.Domain.Entities;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services.Interfaces;

public interface IVacationService
{
    Task<List<VacationInfo>> GetAllVacationInfoAsync();
    
    Task<DbVacation> Create(CreateVacationRequest model);
    Task<List<DbVacation>> GetAll();
    Task<DbVacation> GetById( int id );
}
