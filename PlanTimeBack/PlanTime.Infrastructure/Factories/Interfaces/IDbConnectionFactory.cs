using System.Data.Common;

namespace PlanTime.Infrastructure.Factories.Interfaces;

/// <summary>
/// Представляет интерфейс фабрики подключений к базе данных.
/// </summary>
public interface IDbConnectionFactory
{
    /// <summary>
    /// Создает асинхронное подключение к базе данных.
    /// </summary>
    Task<DbConnection> CreateAsync();
}