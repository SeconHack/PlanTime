using System.Security.Claims;
using PlanTime.Application.Dto;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Common.Authentication.Hash.Interfaces;
using PlanTime.Domain.Entities;
using PlanTime.Domain.Exceptions.Auth;

namespace PlanTime.Application.Services;

public class AuthenticationService(
    IAccountService accountService,
    IRoleService roleService,
    IProfessionService professionService,
    IPasswordHasher passwordHasher,
    IJwtTokenService jwtService,IMailServiceSender mailServiceSender) : IAuthenticationService
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
        var role = await roleService.GetById(roleId);
        var profession = await professionService.GetById(professionId);
        var roleName = role.RoleName;
        var candidate = await accountService.CreateAsync(new AccountDto
        {
            Email = email,
            LastName = lastName,
            FirstName = firstName,
            MiddleName = middleName,
            Phone = phone,
            HashedPassword = hashedPassword,
            DivisionId = divisionId,
            CountVacationDays = profession.CountVacationDays,
            RoleId = roleId,
            ProfessionId = professionId
        });

        var token = await jwtService.CreateAccessTokenAsync(new List<Claim>
        {
            new(ClaimTypes.Email, email),
            new(ClaimTypes.Role, roleName),
            new("id", candidate.Id.ToString())
        });
        mailServiceSender.SendMail(email, "Вас зарегистрировали в программе выбора отпусков", "Ваш логин " + email + "\n Ваш пароль " + password);
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