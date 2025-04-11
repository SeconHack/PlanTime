namespace PlanTime.Models.Auth.Request;

public class RegisterRequest
{
    public string Email { get; set; }
    public string LastName { get; set; }
    public string FirstName { get; set; }
    public string MiddleName { get; set; }
    public string Phone { get; set; }
    public int ProfessionId { get; set; }
    public string Password { get; set; }

    public void Deconstruct(
        out string email,
        out string lastName,
        out string firstName,
        out string middleName,
        out string phone,
        out int professionId,
        out string password)
    {
        email = Email;
        lastName = LastName;
        firstName = FirstName;
        middleName = MiddleName;
        phone = Phone;
        professionId = ProfessionId;
        password = Password;
    }
}