using PlanTime.Domain.Exceptions.Shared;

namespace PlanTime.Domain.Exceptions.Profession;

/// <summary>
/// Исключение, указывающее на то, что должность не была найдена.
/// </summary>
public class ProfessionNotFoundException(string message) : NotFoundException(message)
{
    /// <summary>
    /// Создает новый экземпляр исключения с сообщением о том, что учетная запись с указанным идентификатором не была найдена.
    /// </summary>
    /// <param name="id">Идентификатор учетной записи, которая не была найдена.</param>
    /// <returns>Новый экземпляр исключения <see cref="ProfessionNotFoundException"/>.</returns>
    public static ProfessionNotFoundException WithSuchId(int id)
    {
        return new ProfessionNotFoundException($"Profession with id \"{id}\" has not been found");
    }
}