namespace PlanTime.Common.Authentication.Jwt.Interfaces;

/// <summary>
/// Интерфейс для настроек JWT (JSON Web Token).
/// </summary>
public interface IJwtSettings
{
    /// <summary>
    /// Получает издателя токена.
    /// </summary>
    public string Issuer { get; }

    /// <summary>
    /// Получает аудиторию токена.
    /// </summary>
    public string Audience { get; }

    /// <summary>
    /// Получает ключ для подписи токена.
    /// </summary>
    public string Key { get; }

    /// <summary>
    /// Получает время жизни токена в часах.
    /// </summary>
    public int TokenExpiresAfterHours { get; }

    /// <summary>
    /// Получает время жизни refresh-токена в часах.
    /// </summary>
    public int RefreshTokenExpiresAfterHours { get; }
}