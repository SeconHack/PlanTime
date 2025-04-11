using PlanTime.Application.Dto;
using PlanTime.Domain.Entities;
using PlanTime.Models.Profession.Request;

namespace PlanTime.Application.Services.Interfaces;

public interface IProfessionService
{
    Task<DbProfession> Create(CreateProfessionRequest model);
    Task<List<DbProfession>> GetAll();
    Task<DbProfession> GetById(int id);
}