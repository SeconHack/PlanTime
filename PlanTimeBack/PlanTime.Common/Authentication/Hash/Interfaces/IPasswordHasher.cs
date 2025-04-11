namespace PlanTime.Common.Authentication.Hash.Interfaces;

/// <summary>
/// Интерфейс для хеширования и проверки паролей.
/// </summary>
public interface IPasswordHasher
{
    /// <summary>
    /// Хеширует указанный пароль.
    /// </summary>
    /// <param name="password">Пароль для хеширования.</param>
    /// <returns>Хеш пароля.</returns>
    string Hash(string password);

    /// <summary>
    /// Проверяет соответствие пароля и хеша пароля.
    /// </summary>
    /// <param name="password">Пароль для проверки.</param>
    /// <param name="hash">Хеш пароля.</param>
    /// <returns>True, если пароль соответствует хешу, в противном случае - false.</returns>
    bool Verify(string password, string hash);
}