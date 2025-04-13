using System.Net;
using System.Net.Mail;
using PlanTime.Application.Services.Interfaces;

namespace PlanTime.Application.Services;

public class MailServiceSender : IMailServiceSender
{
    private const string From = "bekname@mail.ru"; // адреса отправителя
    private const string Pass = "mTHjQWEqreWjVB1Fdetz"; // пароль отправителя
    private const string Smtp = "smtp.mail.ru";
    private readonly SmtpClient _client;

    public MailServiceSender()
    {
        _client = new SmtpClient();
        _client.Host = Smtp; //smtp-сервер отправителя
        _client.Port = 587;
        _client.EnableSsl = true;
        _client.Credentials = new NetworkCredential(From.Split('@')[0], Pass);
        _client.DeliveryMethod = SmtpDeliveryMethod.Network;
    }
    public (int, string) SendMail(string to, string subject, string body)
    {
        try
        {
            MailMessage mess = new MailMessage();
            mess.To.Add(to); // адрес получателя
            mess.From = new MailAddress(From);
            mess.Subject = subject; // тема
            mess.Body = body; // текст сообщения
            _client.Send(mess); // отправка пользователю
            
            mess.To.Remove(mess.To[0]);
            mess.To.Add(From); //для сообщения на свой адрес
            mess.Subject = "Отправлено сообщение";
            mess.Body = "Пользователю отправлено сообщение";
            _client.Send(mess); // отправка себе
            mess.Dispose();
        }
        catch (Exception e)
        {
            return (1, e.Message);
        }
        return (0, "success");
    }
}