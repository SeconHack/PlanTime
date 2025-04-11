using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;

namespace PlanTime.Api.Controllers.V1;

[AllowAnonymous]
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
        return Ok(await accountService.GetByIdAsync(UserId));
    }
}