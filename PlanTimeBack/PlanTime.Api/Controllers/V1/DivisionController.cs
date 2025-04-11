using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;

namespace PlanTime.Api.Controllers.V1;

[AllowAnonymous]
public class DivisionController(IDivisionService divisionService) : ApiControllerV1
{
    [HttpPost("{name}")]
    public async Task<IActionResult> Create(string name)
    {
        var result = await divisionService.Create(name);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await divisionService.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await divisionService.GetById(id);
        return Ok(result);
    }

}