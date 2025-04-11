using PlanTime.Domain.Exceptions.Shared;

namespace PlanTime.Domain.Exceptions.Account;

/// <summary>
/// Исключение, указывающее на то, что учетная запись не была найдена.
/// </summary>
public class AccountNotFoundException(string message) : NotFoundException(message)
{
    /// <summary>
    /// Создает новый экземпляр исключения с сообщением о том, что учетная запись с указанным идентификатором не была найдена.
    /// </summary>
    /// <param name="id">Идентификатор учетной записи, которая не была найдена.</param>
    /// <returns>Новый экземпляр исключения <see cref="AccountNotFoundException"/>.</returns>
    public static AccountNotFoundException WithSuchId(int id)
    {
        return new AccountNotFoundException($"Account with id \"{id}\" has not been found");
    }

    /// <summary>
    /// Создает новый экземпляр исключения с сообщением о том, что учетная запись с указанным адресом электронной почты не была найдена.
    /// </summary>
    /// <param name="email">Адрес электронной почты учетной записи, которая не была найдена.</param>
    /// <returns>Новый экземпляр исключения <see cref="AccountNotFoundException"/>.</returns>
    public static AccountNotFoundException WithSuchEmail(string email)
    {
        return new AccountNotFoundException($"Account with email \"{email}\" has not been found");
    }
}