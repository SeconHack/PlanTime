using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Common.Authentication.Jwt;

namespace PlanTime.Api.Controllers.Abstract;

/// <summary>
/// Базовый контроллер для авторизованных пользователей.
/// </summary>
/// <remarks>
/// Этот абстрактный контроллер предоставляет общие функциональности для всех контроллеров, 
/// которые требуют аутентификации пользователя.
/// </remarks>
[Authorize]
[ApiController]
public class BaseAuthController : ControllerBase
{
    /// <summary>
    /// Получает значение заголовка авторизации из текущего HTTP-запроса.
    /// </summary>
    private string AuthHeader => HttpContext.Request.Headers.Authorization.ToString();
    
    /// <summary>
    /// Получает идентификатор пользователя из JWT.
    /// </summary>
    protected int UserId => int.Parse(JwtReader.GetId(AuthHeader));
    
    /// <summary>
    /// Получает роль пользователя из JWT.
    /// </summary>
    protected string Role => JwtReader.GetRole(AuthHeader);
    
    /// <summary>
    /// Получает email пользователя из JWT.
    /// </summary>
    protected string Email => JwtReader.GetEmail(AuthHeader);
}