﻿using PlanTime.Application.Services;
using PlanTime.Application.Services.Interfaces;

namespace PlanTime.Api.Extensions;

/// <summary>
/// Расширения для настройки сервисов приложения.
/// </summary>
/// <remarks>
/// Этот класс содержит методы для добавления сервисов приложения в контейнер зависимостей.
/// </remarks>
public static class ApplicationHostExtensions
{
    /// <summary>
    /// Добавляет сервисы приложения в коллекцию сервисов.
    /// </summary>
    /// <param name="services">Коллекция сервисов.</param>
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IAccountService, AccountService>();
        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IProfessionService, ProfessionService>();
        services.AddScoped<IVacationService, VacationService>();
        services.AddScoped<IDivisionService, DivisionService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IRecordService, RecordService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IMailServiceSender, MailServiceSender>();
    }
}