namespace PlanTime.Application.Services.Interfaces;

public interface IRecordService
{
    Task<bool> AddAsync(Stream stream);
}