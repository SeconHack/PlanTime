using PlanTime.Application.Dto;
using PlanTime.Application.Dto.Mappers;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Exceptions.Account;
using PlanTime.Domain.Repositories;

namespace PlanTime.Application.Services;

public class AccountService(IAccountRepository repository) : IAccountService
{
    public async Task<AccountDto> GetByIdAsync(int id)
    {
        var candidate = await repository.GetByIdAsync(id);

        if (candidate is null) throw AccountNotFoundException.WithSuchId(id);

        return candidate.ToDto();
    }

    public async Task<AccountDto> GetByEmailAsync(string email)
    {
        var candidate = await repository.GetByEmailAsync(email);

        if (candidate is null) throw AccountNotFoundException.WithSuchEmail(email);

        return candidate.ToDto();
    }

    public async Task<AccountDto> CreateAsync(AccountDto dto)
    {
        var candidate = await repository.CreateAsync(new DbAccount
        {
            Email = dto.Email,
            HashedPassword = dto.HashedPassword,
            LastName = dto.LastName,
            FirstName = dto.FirstName,
            MiddleName = dto.MiddleName,
            Phone = dto.Phone,
            CountVacationDays = dto.CountVacationDays,
            RoleId = dto.RoleId,
            DivisionId = dto.DivisionId,
            ProfessionId = dto.ProfessionId
        });

        return candidate.ToDto();
    }

    public async Task<List<AccountDto>> GetAllAsync()
    {
        var candidates = await repository.GetAllAsync();
        var candidateDto = new List<AccountDto>(candidates.Count);
        foreach (var candidate in candidates)
        {
            candidateDto.Add(candidate.ToDto());    
        }

        return candidateDto;
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await repository.ExistsByEmailAsync(email);
    }
}