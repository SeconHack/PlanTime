using PlanTime.Domain.Entities;

namespace PlanTime.Domain.Repositories;

/// <summary>
/// Представляет интерфейс репозитория для работы с учетными записями.
/// </summary>
public interface IAccountRepository
{
    /// <summary>
    /// Получает учетную запись по идентификатору.
    /// </summary>
    Task<DbAccount> GetByIdAsync(int id);

    /// <summary>
    /// Создает новую учетную запись.
    /// </summary>
    Task<DbAccount> CreateAsync(DbAccount dbAccount);

    /// <summary>
    /// Обновляет существующую учетную запись.
    /// </summary>
    Task<DbAccount> UpdateAsync(DbAccount dbAccount, int id);

    /// <summary>
    /// Удаляет учетную запись по идентификатору.
    /// </summary>
    Task RemoveAsync(int id);

    /// <summary>
    /// Проверяет, существует ли учетная запись с указанным адресом электронной почты.
    /// </summary>
    Task<bool> ExistsByEmailAsync(string email);

    /// <summary>
    /// Проверяет, существует ли учетная запись с указанным идентификатором.
    /// </summary>
    Task<bool> ExistsByIdAsync(int id);

    /// <summary>
    /// Получает учетную запись по адресу электронной почты.
    /// </summary>
    Task<DbAccount> GetByEmailAsync(string email);
}