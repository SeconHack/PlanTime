using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services;

public class VacationService : IVacationService
{
    private readonly IAccountRepository _accountRepository;
    private readonly IVacationRepository _vacationRepository;
    private readonly IDivisionRepository _divisionRepository;

    public VacationService(IAccountRepository accountRepository, IVacationRepository vacationRepository, IDivisionRepository divisionRepository)
    {
        _accountRepository = accountRepository;
        _vacationRepository = vacationRepository;
        _divisionRepository = divisionRepository;
    }

    public async Task<List<VacationInfo>> GetAllVacationInfoAsync()
    {
        var vacations = await _vacationRepository.GetAllAsync();
        var allVacationInfo = new List<VacationInfo>();

        foreach (var vacation in vacations)
        {
            var user = await _accountRepository.GetByIdAsync(vacation.UserId);
            var division = await _divisionRepository.GetByIdAsync(user.DivisionId);
            var divisionName = division.DivisionName;
            allVacationInfo.Add(new VacationInfo(
                user.LastName,
                divisionName,
                vacation.StartDate,
                vacation.EndDate
            ));
        }
        return allVacationInfo;
    }

    public async Task<DbVacation> Create(int userId ,CreateVacationRequest model)
    {
        
        var vacation = new DbVacation
        {
            Id = 0,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
            UserId = userId
        };
        var candidate = await _vacationRepository.CreateAsync(vacation);
        return candidate;
    }

    public async Task<List<DbVacation>> GetAll()
    {
        var vacations = await _vacationRepository.GetAllAsync();
        return vacations;
    }

    public async Task<DbVacation> GetById(int id)
    {
        var vacation = await _vacationRepository.GetByIdAsync(id);
        return vacation;
    }
}
