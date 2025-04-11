namespace PlanTime.Domain.Exceptions.Shared;

/// <summary>
/// Исключение, указывающее на то, что запрос был неверным.
/// </summary>
public class BadRequestException : Exception
{
    /// <summary>
    /// Создает новый экземпляр исключения с указанным сообщением.
    /// </summary>
    /// <param name="message">Сообщение об ошибке.</param>
    public BadRequestException(string message) : base(message) { }
}