using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Models.Vacations;

namespace PlanTime.Api.Controllers.V1;

public class VacationController(IVacationService vacationService) : ApiControllerV1
{
    [HttpPost]
    [Authorize(Roles = "Leader,Director")]
    public async Task<ActionResult> Create(CreateVacationRequest model)
    {
        var result = await vacationService.Create(UserId,model);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        var result = await vacationService.GetAll();
        return Ok(result);

    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await vacationService.GetById(id);
        return Ok(result);
    }
}