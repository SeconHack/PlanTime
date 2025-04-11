using System.Security.Claims;
using PlanTime.Application.Dto;

namespace PlanTime.Application.Services.Interfaces;

/// <summary>
/// Интерфейс сервиса генерации JWT токенов.
/// </summary>
public interface IJwtTokenService
{
    /// <summary>
    /// Создает JWT токен на основе предоставленных утверждений (claims) асинхронно.
    /// </summary>
    /// <param name="claims">Коллекция утверждений, которые будут включены в токен.</param>
    /// <returns>DTO (Data Transfer Object) токена аутентификации.</returns>
    Task<TokenDto> CreateAccessTokenAsync(ICollection<Claim> claims);
}