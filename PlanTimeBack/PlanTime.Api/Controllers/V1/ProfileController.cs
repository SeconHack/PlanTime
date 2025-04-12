using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;

namespace PlanTime.Api.Controllers.V1;

public class ProfileController(IAccountService accountService) : ApiControllerV1
{
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAccountById(int id)
    {
        return Ok(await accountService.GetByIdAsync(id));
    }
    
    [HttpGet("me")]
    public async Task<IActionResult> GetProfile()
    {
        var result = await accountService.GetByIdAsync(UserId);
        return Ok(result);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await accountService.GetAllAsync());
    }
}