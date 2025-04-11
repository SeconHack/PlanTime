using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;

namespace PlanTime.Application.Services;

public class RoleService(IRoleRepository roleRepository) : IRoleService
{
    public async Task<DbRole> Create(string name)
    {
        var role = new DbRole
        {
            Id = 0,
            RoleName = name
        };
        
        var candidate = await roleRepository.CreateAsync(role);
        return candidate;
    }

    public async Task<DbRole> GetById(int id)
    {
        var role = await roleRepository.GetByIdAsync(id);
        return role;
    }

    public async Task<List<DbRole>> GetAll()
    {
        var roles = await roleRepository.GetAllAsync();
        return roles;
    }
}