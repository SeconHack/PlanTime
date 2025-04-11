using Durak.Dapper.Models;

namespace Durak.Dapper.Interfaces;

public interface IDapperSettings
{
    string ConnectionString { get; }
    Provider Provider { get; }
}