using System.Text.Json.Serialization;

namespace PlanTime.Application.Dto;

public class AccountDto
{
    /// <summary>
    /// Идентификатор аккаунта.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Электронная почта аккаунта.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// Фамилия пользователя.
    /// </summary>
    public string LastName { get; set; }
    
    /// <summary>
    /// Имя пользователя.
    /// </summary>
    public string FirstName { get; set; }
    
    /// <summary>
    /// Отчество пользователя.
    /// </summary>
    public string MiddleName { get; set; }
    
    /// <summary>
    /// Номер телефона пользователя.
    /// </summary>
    public string Phone { get; set; }
    
    /// <summary>
    /// Идентификатор профессии пользователя.
    /// </summary>
    public int ProfessionId { get; set; }
    
    /// <summary>
    /// Идентификатор роли пользователя.
    /// </summary>
    public int RoleId { get; set; }
    
    public int DivisionId { get; set; }
    
    /// <summary>
    /// Захешированный пароль аккаунта (игнорируется при сериализации).
    /// </summary>
    [JsonIgnore]
    public string HashedPassword { get; set; }
}