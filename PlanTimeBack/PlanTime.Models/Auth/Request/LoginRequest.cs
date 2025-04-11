namespace PlanTime.Models.Auth.Request;

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }

    public void Deconstruct(out string email, out string password)
    {
        email = Email;
        password = Password;
    }
}