using PlanTime.Domain.Exceptions.Shared;

namespace PlanTime.Domain.Exceptions.Account;

/// <summary>
/// Исключение, указывающее на то, что учетная запись уже существует.
/// </summary>
public class AccountAlreadyExistsException(string message) : BadRequestException(message)
{
    /// <summary>
    /// Создает новый экземпляр исключения с сообщением о том, что учетная запись с указанным адресом электронной почты уже существует.
    /// </summary>
    /// <param name="email">Адрес электронной почты, который уже используется.</param>
    /// <returns>Новый экземпляр исключения <see cref="AccountAlreadyExistsException"/>.</returns>
    public static AccountAlreadyExistsException WithSuchEmail(string email)
    {
        return new AccountAlreadyExistsException($"Account with email \"{email}\" already exists.");
    }
}