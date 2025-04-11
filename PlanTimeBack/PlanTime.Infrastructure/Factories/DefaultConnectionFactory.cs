using System.Data.Common;
using Microsoft.Extensions.Configuration;
using Npgsql;
using PlanTime.Infrastructure.Factories.Interfaces;

namespace PlanTime.Infrastructure.Factories;

public class DefaultConnectionFactory(IConfiguration configuration) : IDbConnectionFactory
{
    public async Task<DbConnection> CreateAsync()
    {
        var connection = new NpgsqlConnection(configuration.GetConnectionString("Default"));
        await connection.OpenAsync();
        return connection;
    }
}