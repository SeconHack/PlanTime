using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PlanTime.Common.Authentication.Hash;
using PlanTime.Common.Authentication.Hash.Interfaces;
using PlanTime.Common.Authentication.Jwt;
using PlanTime.Common.Authentication.Jwt.Interfaces;

namespace PlanTime.Api.Extensions;

/// <summary>
/// Расширения для настройки аутентификации в приложении.
/// </summary>
/// <remarks>
/// Этот класс содержит методы для добавления аутентификации JWT и регистрации компонентов модуля аутентификации в контейнере зависимостей.
/// </remarks>
public static class AuthenticationExtensions
{
    /// <summary>
    /// Добавляет аутентификацию JWT в коллекцию сервисов.
    /// </summary>
    /// <param name="services">Коллекция сервисов.</param>
    /// <param name="configuration">Конфигурация приложения.</param>
    public static void AddJwtAuth(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAuthorization();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                var authSettings = configuration.GetSection("Jwt");
                options.ClaimsIssuer = authSettings["Issuer"];
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authSettings["Issuer"],
                    ValidateAudience = true,
                    ValidAudience = authSettings["Audience"],
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authSettings["Key"])),
                    ValidateIssuerSigningKey = true
                };
            });
    }

    /// <summary>
    /// Добавляет модуль аутентификации в коллекцию сервисов.
    /// </summary>
    /// <param name="services">Коллекция сервисов.</param>
    public static void AddAuthModule(this IServiceCollection services)
    {
        services.AddSingleton<IJwtSettings, JwtSettings>();
        services.AddSingleton<IPasswordHasher, BCryptPasswordHasher>();
    }
}