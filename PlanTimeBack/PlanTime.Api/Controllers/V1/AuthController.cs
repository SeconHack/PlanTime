using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Dto;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Auth.Request;
using LoginRequest = PlanTime.Models.Auth.Request.LoginRequest;

namespace PlanTime.Api.Controllers.V1;

[AllowAnonymous]
public class AuthController(
    IAuthenticationService authService,
    IVacationService vacationService,
    IProfessionService professionService,
    IDivisionService divisionService,
    IRoleService roleService,
    IAccountService accountService
) : ApiControllerV1
{
    [Authorize(Roles = "Admin")]
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
        var (email, lastName, firstName, middleName, phone, professionId, roleId, divisionId, password) =
            registerRequest;

        var result = await authService.RegisterAsync(
            email,
            lastName,
            firstName,
            middleName,
            phone,
            professionId,
            roleId,
            divisionId,
            password);

        return Ok(result);
    }

    [HttpGet("getAll")]
    public async Task<IActionResult> GetAll()
    {
        var result = await vacationService.GetAllVacationInfoAsync();
        return Ok(result);
    }

    [HttpPost("registerFromFile")]
    public async Task<IActionResult> RegisterFromFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Файл не загружен.");

        using var stream = new MemoryStream();
        await file.CopyToAsync(stream);

        using var workbook = new XLWorkbook(stream);
        var worksheet = workbook.Worksheet(1);
        var rows = worksheet.RangeUsed().RowsUsed().Skip(1);

        var failedEmails = new List<string>();
        
        foreach (var row in rows)
        {
            var email = row.Cell(2).GetValue<string>()?.Trim();
            var password = row.Cell(3).GetValue<string>()?.Trim();
            var lastName = row.Cell(4).GetValue<string>()?.Trim();
            var firstName = row.Cell(5).GetValue<string>()?.Trim();
            var middleName = row.Cell(6).GetValue<string>()?.Trim();
            var phone = row.Cell(7).GetValue<string>()?.Trim();
            var professionName = row.Cell(8).GetValue<string>()?.Trim();
            var divisionName = row.Cell(9).GetValue<string>()?.Trim();
            
            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password) ||
                string.IsNullOrEmpty(lastName) || string.IsNullOrEmpty(firstName))
            {
                failedEmails.Add(email ?? "(пустой email)");
                continue;
            }
            
            var exists = await accountService.ExistsByEmailAsync(email);
            if (exists)
            {
                failedEmails.Add(email + " (уже существует)");
                continue;
            }
            
            int? professionId = await professionService.GetIdByNameAsync(professionName);

            int? divisionId = await divisionService.GetIdByNameAsync(divisionName);
            
            int? roleId = await roleService.GetIdByNameAsync("Worker");
            
            if (professionId == null)
            {
                failedEmails.Add(email + $" (профессия {professionName} не найдена)");
                continue;
            }
            
            if (divisionId == null)
            {
                failedEmails.Add(email + $" (подразделение {divisionName} не найдено)");
                continue;
            }
            
            if (roleId == null)
            {
                failedEmails.Add(email + " (роль Worker не найдена");
                continue;
            }
            
            await authService.RegisterAsync(
                email,
                lastName,
                firstName,
                middleName,
                phone,
                professionId.Value,
                roleId.Value,
                divisionId.Value,
                password);
        }

        if (failedEmails.Count > 0)
        {
            return Ok(new
            {
                Message = "Регистрация завершена с ошибками.",
                FailedEmails = failedEmails
            });
        }
        
        return Ok("Пользователи из файла успешно зарегистрированы.");
    }
}