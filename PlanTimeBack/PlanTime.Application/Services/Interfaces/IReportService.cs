﻿using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services.Interfaces;

public interface IReportService
{
    Task<(int,string)> SaveReportAsync(int userId);
    Task<List<List<VacationInfo>>> GetIntersectionsAsync(int userId);

    Task DeleteVocationWithNotificationAsync(int vacationId);
    Task<(int, string, MemoryStream)> GetFinalReportAsync(int userId);
}