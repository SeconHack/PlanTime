using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Exceptions.Account;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Repositories.Scripts.Account;

namespace PlanTime.Infrastructure.Repositories;

public class AccountRepository(IDapperContext<IDapperSettings> dapperContext) : IAccountRepository
{
    public async Task<DbAccount> GetByIdAsync(int id)
    {
        return await dapperContext.FirstOrDefault<DbAccount>(new QueryObject(User.GetById, new { id }));
    }

    public async Task<DbAccount> CreateAsync(DbAccount dbAccount)
    {
        return await dapperContext.CommandWithResponse<DbAccount>(new QueryObject(User.Create, dbAccount));
    }

    public async Task<DbAccount> UpdateAsync(DbAccount dbAccount, int id)
    {
        return await dapperContext.CommandWithResponse<DbAccount>(new QueryObject(User.Update, dbAccount));
    }

    public async Task RemoveAsync(int id)
    {
        await dapperContext.Command(new QueryObject(User.Delete, new { id }));
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await dapperContext.CommandWithResponse<bool>(new QueryObject(User.ExistsByEmail, new { email }));
    }

    public async Task<bool> ExistsByIdAsync(int id)
    {
        return await dapperContext.CommandWithResponse<bool>(new QueryObject(User.ExistsById, new { id }));
    }

    public async Task<DbAccount> GetByEmailAsync(string email)
    {
        return await dapperContext.FirstOrDefault<DbAccount>(new QueryObject(User.GetByEmail, new { email }));
    }
}