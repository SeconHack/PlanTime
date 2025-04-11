using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PlanTime.Common.Authentication.Jwt;

/// <summary>
/// Класс для чтения информации из JWT токена.
/// </summary>
public static class JwtReader
{
    /// <summary>
    /// Получает идентификатор пользователя из JWT токена.
    /// </summary>
    /// <param name="token">JWT токен.</param>
    /// <returns>Идентификатор пользователя.</returns>
    public static string? GetId(string token)
    {
        return ParseToken(token, "id");
    }

    /// <summary>
    /// Получает электронную почту пользователя из JWT токена.
    /// </summary>
    /// <param name="token">JWT токен.</param>
    /// <returns>Электронная почта пользователя.</returns>
    public static string? GetEmail(string token)
    {
        return ParseToken(token, "email");
    }

    /// <summary>
    /// Получает роль пользователя из JWT токена.
    /// </summary>
    /// <param name="token">JWT токен.</param>
    /// <returns>Роль пользователя.</returns>
    public static string? GetRole(string token)
    {
        return ParseToken(token, "role");
    }

    private static string? ParseToken(string token, string role)
    {
        var removeBearer = token.Split(' ')[1];
        var handler = new JwtSecurityTokenHandler();
        var tokenData = handler.ReadJwtToken(removeBearer).Payload;
        return tokenData.Claims.FirstOrDefault(c => c.Type.Split('/').Last() == role)?.Value;
    }

    /// <summary>
    /// Создает список утверждений (claims) для пользователя с указанным идентификатором, электронной почтой и ролью.
    /// </summary>
    /// <param name="id">Идентификатор пользователя.</param>
    /// <param name="email">Электронная почта пользователя.</param>
    /// <param name="role">Роль пользователя.</param>
    /// <returns>Список утверждений (claims).</returns>
    public static List<Claim> GetClaims(int id, string email, string role)
    {
        var claims = new List<Claim>
        {
            new("id", id.ToString()),
            new("email", email),
            new("role", role)
        };
        
        return claims;
    }
}