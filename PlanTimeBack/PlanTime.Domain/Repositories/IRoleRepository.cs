using PlanTime.Domain.Entities;

namespace PlanTime.Domain.Repositories;

/// <summary>
/// Представляет интерфейс репозитория для работы с учетными записями.
/// </summary>
public interface IRoleRepository
{
    /// <summary>
    /// Создает новую роль.
    /// </summary>
    Task<DbRole> CreateAsync(DbRole dbRole);
    
    /// <summary>
    /// Получает список всех ролей.
    /// </summary>
    Task<List<DbRole>> GetAllAsync();
    
    /// <summary>
    /// Получает роль по идентификатору.
    /// </summary>
    Task<DbRole> GetByIdAsync(int id);
}