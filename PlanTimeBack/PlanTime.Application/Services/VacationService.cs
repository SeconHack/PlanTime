using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Exceptions.Vacation;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services;

public class VacationService(
    IAccountRepository accountRepository,
    IVacationRepository vacationRepository,
    IDivisionRepository divisionRepository) : IVacationService
{
    public async Task<List<VacationInfo>> GetVacationInfoByDivisionIdAsync(int divisionId)
    {
        var vacations = await vacationRepository.GetAllAsync();
        var allVacationInfo = new List<VacationInfo>();

        foreach (var vacation in vacations)
        {
            var user = await accountRepository.GetByIdAsync(vacation.UserId);
            if(user.DivisionId != divisionId)continue;
            var division = await divisionRepository.GetByIdAsync(user.DivisionId);
            var divisionName = division.DivisionName;
            allVacationInfo.Add(new VacationInfo(
                vacation.UserId,
                vacation.Id,
                user.Email,
                divisionName,
                vacation.StartDate,
                vacation.EndDate
            ));
        }
        return allVacationInfo;
    }

    public async Task<DbVacation> Create(int userId, CreateVacationRequest model)
    {
        if (model.StartDate > model.EndDate)
            throw BadDateException.BadDate(model.StartDate, model.EndDate);
        
        var vacations = await vacationRepository.GetAllAsync();
        var yearNow = DateTime.Now.Year;
        
        var myVacations = vacations.FindAll(v => v.UserId == userId && 
                                                (v.StartDate.Year == yearNow || v.EndDate.Year == yearNow));

        foreach (var myVacation in myVacations)
        {
            bool isOverlap = model.StartDate <= myVacation.EndDate &&
                             model.EndDate >= myVacation.StartDate;

            if (isOverlap)
            {
                throw BadDateException.VacationOverlap(
                    myVacation.StartDate, myVacation.EndDate);
            }
        }
        
        var account = await accountRepository.GetByIdAsync(userId);
        /*var count  = vacations.Count(v => 
            v.UserId == userId &&
            (v.StartDate.Year == yearNow || v.EndDate.Year == yearNow));*/
        
        if(model.EndDate < model.StartDate + TimeSpan.FromDays(14) && account.CountVacationDays <= 14)
            throw BadDateException.BadDateCountDate(model.StartDate, model.EndDate);
        
        var vacationDate = (int)(model.EndDate - model.StartDate).TotalDays;
        
        if(account.CountVacationDays < vacationDate)
            throw BadDateException.BadCountVacationDays(account.CountVacationDays, model.StartDate, model.EndDate);
        
        var vacation = new DbVacation
        {
            Id = 0,
            StartDate = model.StartDate,
            EndDate = model.EndDate,
            UserId = userId
        };
        
        account.CountVacationDays -= vacationDate;
        await accountRepository.UpdateAsync(account, userId);
        
        var candidate = await vacationRepository.CreateAsync(vacation);
        return candidate;
    }

    public async Task<List<DbVacation>> GetAll()
    {
        var vacations = await vacationRepository.GetAllAsync();
        return vacations;
    }

    public async Task<DbVacation> GetById(int id)
    {
        var vacation = await vacationRepository.GetByIdAsync(id);
        return vacation;
    }
}
