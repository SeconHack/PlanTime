using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Repositories.Scripts.Division;

namespace PlanTime.Infrastructure.Repositories;

public class DivisionRepository(IDapperContext<IDapperSettings> dapperContext) : IDivisionRepository
{
    public async Task<DbDivision> CreateAsync(DbDivision dbDivision)
    {
        return await dapperContext.CommandWithResponse<DbDivision>(new QueryObject(Division.Create, dbDivision));
    }

    public async Task<List<DbDivision>> GetAllAsync()
    {
        return await dapperContext.ListOrEmpty<DbDivision>(new QueryObject(Division.GetAll));
    }

    public async Task<DbDivision> GetByIdAsync(int id)
    {
        return await dapperContext.FirstOrDefault<DbDivision>(new QueryObject(Division.GetById, new { id }));
    }
}