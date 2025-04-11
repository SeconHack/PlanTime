using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Models.Auth.Request;
using LoginRequest = PlanTime.Models.Auth.Request.LoginRequest;

namespace PlanTime.Api.Controllers.V1;

[AllowAnonymous]
public class AuthController(IAuthenticationService authService) : ApiControllerV1
{
    [HttpPost("login")]
    public async Task<ActionResult> Login(LoginRequest loginRequest)
    {
        var (email, password) = loginRequest;
        
        var result = await authService.LoginAsync(email, password);
        
        return Ok(result);
    }

    [HttpPost("register")]
    public async Task<ActionResult> Register(RegisterRequest registerRequest)
    {
        var (email, lastName, firstName, middleName, phone, professionId, password) = registerRequest;
        
        var result = await authService.RegisterAsync(
            email, 
            lastName,
            firstName,
            middleName,
            phone,
            professionId,
            password);
        
        return Ok(result);
    }
}