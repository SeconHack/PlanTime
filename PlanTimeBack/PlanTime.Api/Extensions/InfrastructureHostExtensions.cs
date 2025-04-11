using System.Reflection;
using DbUp;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Factories;
using PlanTime.Infrastructure.Factories.Interfaces;
using PlanTime.Infrastructure.Repositories;

namespace PlanTime.Api.Extensions;

/// <summary>
/// Расширения для настройки инфраструктурных компонентов приложения.
/// </summary>
/// <remarks>
/// Этот класс содержит методы для настройки базы данных и регистрации репозиториев и фабрик в контейнере зависимостей.
/// </remarks>
public static class InfrastructureHostExtensions
{
    /// <summary>
    /// Выполняет миграцию базы данных для указанного контекста.
    /// </summary>
    /// <typeparam name="TContext">Тип контекста базы данных, наследуемый от DbContext.</typeparam>
    /// <param name="host">Экземпляр IHost, используемый для получения сервисов.</param>
    public static IServiceCollection MigrateDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration["UserServiceDataBase:ConnectionString"];

        EnsureDatabase.For.PostgresqlDatabase(connectionString);

        var upgrader = DeployChanges.To
            .PostgresqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(Assembly.GetExecutingAssembly())
            .WithTransaction()
            .WithVariablesDisabled()
            .LogToConsole()
            .Build();

        if (upgrader.IsUpgradeRequired())
            upgrader.PerformUpgrade();

        return services;
    }

    /// <summary>
    /// Добавляет инфраструктурные сервисы в коллекцию сервисов.
    /// </summary>
    /// <param name="services">Коллекция сервисов.</param>
    public static void AddInfrastructure(this IServiceCollection services)
    {
        services.AddSingleton<IDbConnectionFactory, DefaultConnectionFactory>();


        services.AddScoped<IAccountRepository, AccountRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IProfessionRepository, ProfessionRepository>();

    }
}