using PlanTime.Domain.Exceptions.Shared;

namespace PlanTime.Domain.Exceptions.Auth;

/// <summary>
/// Исключение, указывающее на то, что пароль недействителен.
/// </summary>
public class BadPasswordException() : BadRequestException("Bad password");