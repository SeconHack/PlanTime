using System.Security.Claims;
using PlanTime.Application.Dto;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Common.Authentication.Hash.Interfaces;
using PlanTime.Domain.Exceptions.Auth;

namespace PlanTime.Application.Services;

public class AuthenticationService(
    IAccountService accountService,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtService) : IAuthenticationService
{
    public async Task<TokenDto> RegisterAsync(
        string email,
        string lastName,
        string firstName,
        string middleName,
        string phone,
        int professionId,
        int roleId,
        int divisionId,
        string password)
    {
        var hashedPassword = passwordHasher.Hash(password);

        var candidate = await accountService.CreateAsync(new AccountDto
        {
            Email = email,
            LastName = lastName,
            FirstName = firstName,
            MiddleName = middleName,
            Phone = phone,
            HashedPassword = hashedPassword
        });

        var token = await jwtService.CreateAccessTokenAsync(new List<Claim>
        {
            new("email", email),
            new("role", "worker"),
            new("id", candidate.Id.ToString())
        });

        return token;
    }

    public async Task<TokenDto> LoginAsync(string email, string password)
    {
        var candidate = await accountService.GetByEmailAsync(email);

        if (!passwordHasher.Verify(password, candidate.HashedPassword))
            throw new BadPasswordException();

        var token = await jwtService.CreateAccessTokenAsync(new List<Claim>
        {
            new("email", email),
            new("role", "default"),
            new("id", candidate.Id.ToString())
        });

        return token;
    }
}