using PlanTime.Common.Authentication.Hash.Interfaces;

namespace PlanTime.Common.Authentication.Hash;

/// <summary>
/// Класс для хеширования паролей с использованием алгоритма BCrypt.
/// </summary>
public class BCryptPasswordHasher : IPasswordHasher
{
    /// <summary>
    /// Хеширует указанный пароль с использованием алгоритма BCrypt.
    /// </summary>
    /// <param name="password">Пароль для хеширования.</param>
    /// <returns>Хеш пароля.</returns>
    public string Hash(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    /// <summary>
    /// Проверяет соответствие пароля и хеша пароля с использованием алгоритма BCrypt.
    /// </summary>
    /// <param name="password">Пароль для проверки.</param>
    /// <param name="hash">Хеш пароля.</param>
    /// <returns>True, если пароль соответствует хешу, в противном случае - false.</returns>
    public bool Verify(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}