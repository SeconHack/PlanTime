using PlanTime.Domain.Exceptions.Shared;

namespace PlanTime.Domain.Exceptions.Vacation;

public class BadDateException(string message) : BadRequestException(message)
{
    public static BadDateException BadDateCountDate(DateTime startDate, DateTime endDate)
    {
        return new BadDateException($"Хотя бы один отпуск должен быть 14 дней и больше. Сейчас с {startDate:dd.MM.yyyy} до {endDate:dd.MM.yyyy}");
    }

    public static BadDateException BadDate(DateTime startDate, DateTime endDate)
    {
        return new BadDateException($"Дата начала ({startDate:dd.MM.yyyy}) не должна быть позже конца ({endDate:dd.MM.yyyy}).");
    }

    public static BadDateException VacationOverlap(DateTime startDate, DateTime endDate)
    {
        return new BadDateException($"Данная дата пересекается с другим вашим отпуском с {startDate:dd.MM.yyyy} по {endDate:dd.MM.yyyy}");
    }
    
    public static BadRequestException BadCountVacationDays(int vacationDate, DateTime startDate, DateTime endDate)
    {
        return new BadDateException($"У вас осталось {vacationDate} доступно отпускных дней." +
                                    $" Вы выбрали {(endDate - startDate).TotalDays} дней, с {startDate:dd.MM.yyyy} по {endDate:dd:MM:yyyy}");
    }
}