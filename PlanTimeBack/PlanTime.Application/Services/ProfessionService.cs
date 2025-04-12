using PlanTime.Application.Dto;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Exceptions.Profession;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Profession.Request;

namespace PlanTime.Application.Services;

public class ProfessionService(IProfessionRepository professionRepository) : IProfessionService
{
    public async Task<DbProfession> Create(CreateProfessionRequest model)
    {
        var profession = new DbProfession
        {
            Id = 0,
            CountInterchangeable = model.CountInterchangeable,
            CountVacationDays = model.CountVacationDays,
            ProfessionName = model.ProfessionName
        };
        
        var candidate = await professionRepository.CreateAsync(profession);
        return candidate;
    }

    public async Task<List<DbProfession>> GetAll()
    {
        var professions = await professionRepository.GetAllAsync();
        return professions;
    }

    public async Task<DbProfession> GetById(int id)
    {
        var candidate = await professionRepository.GetByIdAsync(id);
        
        if (candidate is null) 
            throw ProfessionNotFoundException.WithSuchId(id);
        
        return candidate;
    }
    
    public async Task<int?> GetIdByNameAsync(string name)
    {
        var divisions = await professionRepository.GetAllAsync();
        var division = divisions.FirstOrDefault(d => d.ProfessionName == name);
        return division?.Id;
    }
}