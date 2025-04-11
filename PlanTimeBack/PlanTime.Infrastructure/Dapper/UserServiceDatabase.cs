using Durak.Dapper.Interfaces;
using Durak.Dapper.Models;
using Microsoft.Extensions.Configuration;

namespace Durak.Dapper;

public class UserServiceDatabase(IConfiguration configuration) : IDapperSettings
{
    public string ConnectionString => configuration["UserServiceDataBase:ConnectionString"] ?? string.Empty;
    public Provider Provider => Enum.Parse<Provider>(configuration["UserServiceDataBase:Provider"] ?? string.Empty);
}