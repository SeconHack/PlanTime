using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Repositories.Scripts.Profession;
using PlanTime.Infrastructure.Repositories.Scripts.Role;

namespace PlanTime.Infrastructure.Repositories;

public class RoleRepository(IDapperContext<IDapperSettings> dapperContext) : IRoleRepository
{
    public async Task<DbRole> CreateAsync(DbRole dbRole)
    {
        return await dapperContext.CommandWithResponse<DbRole>(new QueryObject(Role.Create, dbRole));
    }

    public async Task<List<DbRole>> GetAllAsync()
    {
        return await dapperContext.ListOrEmpty<DbRole>(new QueryObject(Role.Create));
    }

    public async Task<DbRole> GetByIdAsync(int id)
    {
        return await dapperContext.FirstOrDefault<DbRole>(new QueryObject(Role.Create, new { id }));
    }
}