using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;

namespace PlanTime.Api.Controllers.V1;
[AllowAnonymous]
public class RoleController(IRoleService roleService) : ApiControllerV1
{
    [HttpPost("{name}")]
    public async Task<IActionResult> Create(string name)
    {
        var result = await roleService.Create(name);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await roleService.GetAll();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await roleService.GetById(id);
        return Ok(result);
    }
}