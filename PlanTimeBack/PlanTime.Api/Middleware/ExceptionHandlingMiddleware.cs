using System.Text.Json;
using PlanTime.Domain.Exceptions.Shared;

namespace PlanTime.Api.Middleware;

/// <summary>
/// Конвейер для обработки исключений.
/// </summary>
/// <remarks>
/// Этот конвейер перехватывает исключения, возникающие во время обработки HTTP-запросов,
/// логирует их и возвращает соответствующий ответ клиенту.
/// </remarks>
public class ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger) : IMiddleware
{
    /// <summary>
    /// Обрабатывает входящий HTTP-запрос и перехватывает исключения.
    /// </summary>
    /// <param name="context">Контекст HTTP-запроса.</param>
    /// <param name="next">Делегат для передачи управления следующему компоненту в конвейере.</param>
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception e)
        {
            logger.LogError(e, e.Message);
            await HandleExceptionAsync(context, e);
        }
    }

    /// <summary>
    /// Обрабатывает исключение и формирует ответ клиенту.
    /// </summary>
    /// <param name="httpContext">Контекст HTTP-запроса.</param>
    /// <param name="exception">Исключение, которое нужно обработать.</param>
    private static async Task HandleExceptionAsync(HttpContext httpContext, Exception exception)
    {
        httpContext.Response.ContentType = "application/json";

        httpContext.Response.StatusCode = exception switch
        {
            NotFoundException => StatusCodes.Status404NotFound,
            BadRequestException => StatusCodes.Status400BadRequest,
            _ => StatusCodes.Status500InternalServerError
        };

        var response = new
        {
            Status = httpContext.Response.StatusCode,
            Message = exception.Message
        };

        await httpContext.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}