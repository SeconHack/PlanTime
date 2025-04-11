using PlanTime.Application.Dto;

namespace PlanTime.Application.Services.Interfaces;

/// <summary>
/// Интерфейс сервиса управления аккаунтами.
/// </summary>
public interface IAccountService
{
    /// <summary>
    /// Получает аккаунт по его идентификатору асинхронно.
    /// </summary>
    /// <param name="id">Идентификатор аккаунта.</param>
    /// <returns>DTO (Data Transfer Object) аккаунта.</returns>
    Task<AccountDto> GetByIdAsync(int id);

    /// <summary>
    /// Получает аккаунт по его электронной почте асинхронно.
    /// </summary>
    /// <param name="email">Электронная почта аккаунта.</param>
    /// <returns>DTO (Data Transfer Object) аккаунта.</returns>
    Task<AccountDto> GetByEmailAsync(string email);

    /// <summary>
    /// Создает новый аккаунт асинхронно.
    /// </summary>
    /// <param name="dto">DTO (Data Transfer Object) нового аккаунта.</param>
    /// <returns>DTO (Data Transfer Object) созданного аккаунта.</returns>
    Task<AccountDto> CreateAsync(AccountDto dto);
}