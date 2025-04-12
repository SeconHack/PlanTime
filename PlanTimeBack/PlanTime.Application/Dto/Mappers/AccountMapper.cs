using PlanTime.Domain.Entities;

namespace PlanTime.Application.Dto.Mappers;

/// <summary>
/// Класс-маппер для сопоставления объектов Account и AccountDto.
/// </summary>
public static class AccountMapper
{
    /// <summary>
    /// Преобразует объект типа DbAccount в объект типа AccountDto.
    /// </summary>
    /// <param name="account">Объект типа DbAccount.</param>
    /// <returns>Объект типа AccountDto.</returns>
    public static AccountDto? ToDto(this DbAccount? account)
    {
        return account is null
            ? null
            : new AccountDto
            {
                Email = account.Email,
                Id = account.Id,
                LastName = account.LastName,
                FirstName = account.FirstName,
                MiddleName = account.MiddleName,
                Phone = account.Phone,
                CountVacationDays = account.CountVacationDays,
                RoleId = account.RoleId,
                ProfessionId = account.ProfessionId,
                HashedPassword = account.HashedPassword,
            };
    }
}