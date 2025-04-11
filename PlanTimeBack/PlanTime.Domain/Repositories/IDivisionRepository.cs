using PlanTime.Domain.Entities;

namespace PlanTime.Domain.Repositories;

/// <summary>
/// Представляет интерфейс репозитория для работы с подразделением.
/// </summary>
public interface IDivisionRepository
{
    /// <summary>
    /// Создает новое подразделение.
    /// </summary>
    Task<DbDivision> CreateAsync(DbDivision dbProfession);
    
    /// <summary>
    /// Получает список всех подразделений.
    /// </summary>
    Task<List<DbDivision>> GetAllAsync();
    
    /// <summary>
    /// Получает подразделение по идентификатору.
    /// </summary>
    Task<DbDivision> GetByIdAsync(int id);
}