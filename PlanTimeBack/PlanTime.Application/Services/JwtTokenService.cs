using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PlanTime.Application.Dto;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Common.Authentication.Jwt.Interfaces;

namespace PlanTime.Application.Services;

public class JwtTokenService(IJwtSettings jwtSettings) : IJwtTokenService
{
    public Task<TokenDto> CreateAccessTokenAsync(ICollection<Claim> claims)
    {
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));

        var expires = DateTime.UtcNow.AddHours(jwtSettings.TokenExpiresAfterHours);

        var token = new JwtSecurityToken(
            jwtSettings.Issuer,
            jwtSettings.Audience,
            claims,
            null,
            expires,
            new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256));

        return Task.FromResult(new TokenDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expires = expires
        });
    }
}