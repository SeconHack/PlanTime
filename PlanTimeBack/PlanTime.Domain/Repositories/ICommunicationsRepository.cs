using PlanTime.Domain.Entities;

namespace PlanTime.Domain.Repositories;

public interface ICommunicationsRepository
{
    /// <summary>
    /// Получает список всех подразделений.
    /// </summary>
    Task<List<DbCommunications>> GetAllAsync();
    
    /// <summary>
    /// Получает подразделение по идентификатору.
    /// </summary>
    Task<List<DbCommunications>>GetByChildIdAsync(int childId);
    
    /// <summary>
    /// Получает подразделение по идентификатору.
    /// </summary>
    Task<List<DbCommunications>> GetByParentIdAsync(int parentId);
}