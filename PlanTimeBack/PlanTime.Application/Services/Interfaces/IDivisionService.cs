using PlanTime.Domain.Entities;

namespace PlanTime.Application.Services.Interfaces;

public interface IDivisionService
{
    Task<DbDivision> Create(string name);
    Task<DbDivision> GetById(int id);
    Task<List<DbDivision>> GetAll();
    Task<int?> GetIdByNameAsync(string name);
}