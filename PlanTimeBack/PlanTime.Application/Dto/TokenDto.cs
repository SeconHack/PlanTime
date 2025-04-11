namespace PlanTime.Application.Dto;

/// <summary>
/// DTO (Data Transfer Object) для представления токена аутентификации.
/// </summary>
public class TokenDto
{
    /// <summary>
    /// Токен аутентификации.
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Время истечения токена.
    /// </summary>
    public DateTime Expires { get; set; }
}