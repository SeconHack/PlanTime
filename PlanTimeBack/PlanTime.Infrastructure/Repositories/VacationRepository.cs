using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Repositories.Scripts.Vacation;

namespace PlanTime.Infrastructure.Repositories;

public class VacationRepository(IDapperContext<IDapperSettings> dapperContext) : IVacationRepository
{
    public async Task<DbVacation> CreateAsync(DbVacation dbVacation)
    {
        return await dapperContext.CommandWithResponse<DbVacation>(new QueryObject(Vacation.Create, dbVacation));
    }

    public async Task<List<DbVacation>> GetAllAsync()
    {
        return await dapperContext.ListOrEmpty<DbVacation>(new QueryObject(Vacation.GetAll));
    }

    public async Task<DbVacation> GetByIdAsync(int id)
    {
        return await dapperContext.FirstOrDefault<DbVacation>(new QueryObject(Vacation.GetById, new {id}));
    }

    public async Task DeleteAsync(int id)
    { 
        await dapperContext.Command(new QueryObject(Vacation.Delete, new { id }));
    }
}