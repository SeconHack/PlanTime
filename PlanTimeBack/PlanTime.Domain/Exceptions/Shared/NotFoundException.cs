namespace PlanTime.Domain.Exceptions.Shared;

/// <summary>
/// Исключение, указывающее на то, что запрошенный ресурс не был найден.
/// </summary>
public class NotFoundException : Exception
{
    /// <summary>
    /// Создает новый экземпляр исключения с указанным сообщением.
    /// </summary>
    /// <param name="message">Сообщение об ошибке.</param>
    public NotFoundException(string message) : base(message) { }
}