using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Repositories;

namespace PlanTime.Application.Services;

public class DivisionService(IDivisionRepository divisionRepository) : IDivisionService
{
    public async Task<DbDivision> Create(string name)
    {
        var division = new DbDivision
        {
            Id = 0,
            DivisionName = name
        };
        
        var result = await divisionRepository.CreateAsync(division);
        return result;
    }

    public async Task<DbDivision> GetById(int id)
    {
        var division = await divisionRepository.GetByIdAsync(id);
        return division;
    }

    public async Task<List<DbDivision>> GetAll()
    {
        var divisions = await divisionRepository.GetAllAsync();
        return divisions;
    }

    public async Task<int?> GetIdByNameAsync(string name)
    {
        var divisions = await divisionRepository.GetAllAsync();
        var division = divisions.FirstOrDefault(d => d.DivisionName == name);
        return division?.Id;
    }
}