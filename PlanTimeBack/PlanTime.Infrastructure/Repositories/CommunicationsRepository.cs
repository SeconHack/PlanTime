using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;
namespace PlanTime.Infrastructure.Repositories.Scripts.Communications;

public class CommunicationsRepository(IDapperContext<IDapperSettings> dapperContext) : ICommunicationsRepository
{
    /// <summary>
    /// Получает список всех соединений.
    /// </summary>
    public async Task<List<DbCommunications>> GetAllAsync()
    {
        return await dapperContext.ListOrEmpty<DbCommunications>(new QueryObject(Communications.GetAll));
    }

    /// <summary>
    /// Получает список дочерних подразделений по идентификатору.
    /// </summary>
    public async Task<List<DbCommunications>> GetByChildIdAsync(int childId)
    {
        return await dapperContext.ListOrEmpty<DbCommunications>(new QueryObject(Communications.GetByChildId, new { childId }));
    }

    /// <summary>
    /// Получает список родительских подразделений по идентификатору.
    /// </summary>
    public async Task<List<DbCommunications>> GetByParentIdAsync(int parentId)
    {
        return await dapperContext.ListOrEmpty<DbCommunications>(new QueryObject(Communications.GetByParentId, new { parentId }));
    }
}