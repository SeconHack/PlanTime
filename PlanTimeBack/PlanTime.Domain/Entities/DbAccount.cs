namespace PlanTime.Domain.Entities;

/// <summary>
/// Представляет сущность учетной записи в базе данных.
/// </summary>
public class DbAccount
{
    /// <summary>
    /// Получает или задает идентификатор учетной записи.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Получает или задает адрес электронной почты учетной записи.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Получает или задает хешированный пароль учетной записи.
    /// </summary>
    public string HashedPassword { get; set; }
    
    /// <summary>
    /// Получает или задает фамилию пользователя.
    /// </summary>
    public string LastName { get; set; }
    
    /// <summary>
    /// Получает или задает имя пользователя.
    /// </summary>
    public string FirstName { get; set; }
    
    /// <summary>
    /// Получает или задает отчество пользователя.
    /// </summary>
    public string MiddleName { get; set; }
    
    /// <summary>
    /// Получает или задает номер телефона пользователя.
    /// </summary>
    public string Phone { get; set; }
    
    /// <summary>
    /// Получает или задает идентификатор профессии пользователя.
    /// </summary>
    public int ProfessionId { get; set; }
    
    /// <summary>
    /// Получает или задает идентификатор роли пользователя.
    /// </summary>
    public int RoleId { get; set; }
}