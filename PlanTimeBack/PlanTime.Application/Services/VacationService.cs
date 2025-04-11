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

    public VacationService(IAccountRepository accountRepository, IVacationRepository vacationRepository)
    {
        _accountRepository = accountRepository;
        _vacationRepository = vacationRepository;
    }

    public async Task<List<VacationInfo>> GetAllVacationInfoAsync()
    {
        var accounts = await _accountRepository.GetAllAsync();
        var allVacationInfo = new List<VacationInfo>();

        foreach (var account in accounts)
        {
            if (account.VacationId == null || account.VacationId.Count == 0)
                continue;

            var vacations = new List<DbVacation>();

            foreach (var vacationId in account.VacationId)
            {
                var vacation = await _vacationRepository.GetByIdAsync(vacationId);
                if (vacation != null)
                {
                    vacations.Add(vacation);
                }
            }
            var division = await _divisionRepository.GetByIdAsync(account.DivisionId);
            var divisionName = division?.DivisionName ?? "Неизвестное подразделение";
            foreach (var vacation in vacations)
            {
                allVacationInfo.Add(new VacationInfo(
                    account.LastName,
                    divisionName,
                    vacation.StartDate,
                    vacation.EndDate
                ));
            }
        }

        return allVacationInfo;
    }

    public async Task<DbVacation> Create(CreateVacationRequest model)
    {
        var vacation = new DbVacation
        {
            Id = 0,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
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
