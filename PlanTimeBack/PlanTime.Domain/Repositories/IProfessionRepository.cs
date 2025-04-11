using PlanTime.Domain.Entities;

namespace PlanTime.Domain.Repositories;

/// <summary>
/// Представляет интерфейс репозитория для работы с учетными записями.
/// </summary>
public interface IProfessionRepository
{
    /// <summary>
    /// Создает новую профессию.
    /// </summary>
    Task<DbProfession> CreateAsync(DbProfession dbProfession);
    
    /// <summary>
    /// Получает список всех профессий.
    /// </summary>
    Task<List<DbProfession>> GetAllAsync();
    
    /// <summary>
    /// Получает профессию по идентификатору.
    /// </summary>
    Task<DbProfession> GetByIdAsync(int id);
}