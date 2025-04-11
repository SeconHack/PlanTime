using PlanTime.Domain.Entities;

namespace PlanTime.Application.Services.Interfaces;

public interface IRoleService
{
    Task<DbRole> Create(string name);
    Task<DbRole> GetById(int id);
    Task<List<DbRole>> GetAll();
}