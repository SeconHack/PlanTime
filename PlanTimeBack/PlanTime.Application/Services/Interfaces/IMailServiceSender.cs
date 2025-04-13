namespace PlanTime.Application.Services.Interfaces;

public interface IMailServiceSender
{
    (int, string) SendMail(string to, string subject, string body);
}