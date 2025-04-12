using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Models.Profession.Request;

namespace PlanTime.Api.Controllers.V1;

public class ProfessionController(IProfessionService professionService) : ApiControllerV1
{
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(CreateProfessionRequest createProfessionRequest)
    {
        var result = await professionService.Create(createProfessionRequest);
        return Ok(result);
    }
    
    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await professionService.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await professionService.GetById(id);
        return Ok(result);
    }
}