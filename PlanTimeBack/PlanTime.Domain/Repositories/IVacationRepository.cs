using PlanTime.Domain.Entities;

namespace PlanTime.Domain.Repositories;

/// <summary>
/// Представляет интерфейс репозитория для работы с периодом отпуска.
/// </summary>
public interface IVacationRepository
{
    /// <summary>
    /// Создает новый период отпуска.
    /// </summary>
    Task<DbVacation> CreateAsync(DbVacation dbProfession);
    
    /// <summary>
    /// Получает список всех периодов отпусков.
    /// </summary>
    Task<List<DbVacation>> GetAllAsync();
    
    /// <summary>
    /// Получает период отпуска по идентификатору.
    /// </summary>
    Task<DbVacation> GetByIdAsync(int id);
}