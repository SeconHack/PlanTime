using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Repositories.Scripts.Account;
using PlanTime.Infrastructure.Repositories.Scripts.Profession;

namespace PlanTime.Infrastructure.Repositories;

public class ProfessionRepository(IDapperContext<IDapperSettings> dapperContext) : IProfessionRepository
{
    public async Task<DbProfession> CreateAsync(DbProfession dbProfession)
    {
        return await dapperContext.CommandWithResponse<DbProfession>(new QueryObject(Profession.Create, dbProfession));
    }

    public async Task<List<DbProfession>> GetAllAsync()
    {
        return await dapperContext.ListOrEmpty<DbProfession>(new QueryObject(Profession.Create));
    }

    public async Task<DbProfession> GetByIdAsync(int id)
    {
        return await dapperContext.FirstOrDefault<DbProfession>(new QueryObject(Profession.Create, new { id }));
    }
}