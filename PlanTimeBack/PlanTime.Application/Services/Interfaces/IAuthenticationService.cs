using PlanTime.Application.Dto;

namespace PlanTime.Application.Services.Interfaces;

/// <summary>
/// Интерфейс сервиса аутентификации пользователей.
/// </summary>
public interface IAuthenticationService
{
    /// <summary>
    /// Регистрирует нового пользователя асинхронно и возвращает токен аутентификации.
    /// </summary>
    /// <param name="email">Электронная почта нового пользователя.</param>
    /// <param name="professionId">Идентификатор профессии в базе данных.</param>
    /// <param name="password">Пароль нового пользователя.</param>
    /// <param name="lastName">Фамилия пользователя.</param>
    /// <param name="firstName">Имя пользователя.</param>
    /// <param name="middleName">Отчество пользователя.</param>
    /// <param name="phone">Телефон пользователя.</param>
    /// <returns>DTO (Data Transfer Object) токена аутентификации.</returns>
    Task<TokenDto> RegisterAsync(
        string email, 
        string lastName,
        string firstName,
        string middleName,
        string phone,
        int professionId,
        string password);

    /// <summary>
    /// Аутентифицирует пользователя по указанному логину и паролю и возвращает токен аутентификации.
    /// </summary>
    /// <param name="login">Логин пользователя (электронная почта или имя пользователя).</param>
    /// <param name="password">Пароль пользователя.</param>
    /// <returns>DTO (Data Transfer Object) токена аутентификации.</returns>
    Task<TokenDto> LoginAsync(string login, string password);
}