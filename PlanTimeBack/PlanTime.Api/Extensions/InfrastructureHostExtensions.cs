using System.Reflection;
using DbUp;
using Durak.Dapper;
using Durak.Dapper.Interfaces;
using Minio;
using PlanTime.Application.Services;
using PlanTime.Application.Services.Interfaces;
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
    public static IServiceCollection MigrateDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration["UserServiceDataBase:ConnectionString"];

        EnsureDatabase.For.PostgresqlDatabase(connectionString);

        //var resources = typeof(DapperContext<>).Assembly.GetManifestResourceNames();
        //Console.WriteLine(string.Join("\n", resources));
        
        var upgrader = DeployChanges.To
            .PostgresqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(typeof(DapperContext<>).Assembly)
            .WithTransaction()
            .WithVariablesDisabled()
            .LogToConsole()
            .Build();

        if (upgrader.IsUpgradeRequired())
            upgrader.PerformUpgrade();

        return services;
    }
    
    /// <summary>
    /// Подключение Даппера.
    /// </summary>
    public static IServiceCollection AddDapper(this IServiceCollection services)
    {
        return services
            .AddSingleton<IDapperSettings, UserServiceDatabase>()
            .AddSingleton<IDapperContext<IDapperSettings>, DapperContext<IDapperSettings>>();
    }
    
    /// <summary>
    /// Подключение Cors.
    /// </summary>
    public static IServiceCollection AddCustomCors(this IServiceCollection services)
    {
        return services.AddCors(options =>
        {
            options.AddPolicy("AllowLocalhostAndOtherUrls",
                policy =>
                {
                    policy.WithOrigins("http://localhost:5173",
                            "http://109.73.203.81:5173",
                            "https://109.73.203.81:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
        });
    }
    
    /// <summary>
    /// Подключение хранилища файлов.
    /// </summary>
    public static IServiceCollection AddMinio(this IServiceCollection services)
    {
        return services
            .AddSingleton<IMinioClient>(provider =>
                new MinioClient()
                    .WithEndpoint("minio:9000")
                    .WithCredentials("minioadmin", "minioadmin")
                    .WithSSL(false)
                    .Build());
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
        services.AddScoped<IVacationRepository, VacationRepository>();
        services.AddScoped<IDivisionRepository, DivisionRepository>();
        services.AddScoped<IMinioRepository, MinioRepository>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IMailServiceSender, MailServiceSender>();
    }
}