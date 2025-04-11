using Microsoft.Extensions.Configuration;
using PlanTime.Common.Authentication.Jwt.Interfaces;

namespace PlanTime.Common.Authentication.Jwt;

public class JwtSettings(IConfiguration configuration) : IJwtSettings
{
    public string Issuer
    {
        get
        {
            var jwt = configuration.GetSection("Jwt");
            return jwt["Issuer"] ?? throw new ArgumentException("Invalid Jwt Issuer");
        }
    }

    public string Audience
    {
        get
        {
            var jwt = configuration.GetSection("Jwt");
            return jwt["Audience"] ?? throw new ArgumentException("Invalid Jwt Audience");
            ;
        }
    }

    public string Key
    {
        get
        {
            var jwt = configuration.GetSection("Jwt");
            return jwt["Key"] ?? throw new ArgumentException("Invalid Jwt Key");
        }
    }

    public int TokenExpiresAfterHours
    {
        get
        {
            var jwt = configuration.GetSection("Jwt");

            if (jwt["TokenExpiresInHours"] is null) throw new ArgumentException("Invalid Jwt TokenExpiresInHours");

            return int.Parse(jwt["TokenExpiresInHours"]!);
        }
    }

    public int RefreshTokenExpiresAfterHours
    {
        get
        {
            var jwt = configuration.GetSection("Jwt");

            if (jwt["RefreshTokenExpiresInHours"] is null)
                throw new ArgumentException("Invalid Jwt RefreshTokenExpiresInHours");

            return int.Parse(jwt["RefreshTokenExpiresInHours"]!);
        }
    }
}