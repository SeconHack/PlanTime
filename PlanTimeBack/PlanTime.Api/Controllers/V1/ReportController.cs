using System.IO.Compression;
using System.Net;
using System.Net.Http.Headers;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Repositories;
using PlanTime.Infrastructure.Repositories;
using PlanTime.Models.Vacations;

namespace PlanTime.Api.Controllers.V1;

[Route("api/[controller]")]
public class ReportController(
    IVacationService vacationService,
    IMinioRepository minioRepository,
    IAccountRepository accountRepository,
    IProfessionService professionService,
    IReportService reportService) : ApiControllerV1
{
    [HttpGet("vacations/save-report")]
    public async Task<IActionResult> ExportVacationsToMinio()
    {
        var (code, message) = await reportService.SaveReportAsync(UserId);
        if (code != 0)
            return BadRequest(message);
        return Ok("Файл сохранён");
    }
    [HttpGet("vacations/intersections")]
    public async Task<List<List<VacationInfo>>> GetInterSections()
    {
        return await reportService.GetIntersectionsAsync(UserId);
    }
    [HttpDelete("vacations/{vocationId}")]
    public async Task<IActionResult> DeleteVacationWithInfo(int vocationId)
    {
        reportService.DeleteVocationWithNotificationAsync(vocationId);
        return Ok();
    }

    [HttpPost("vacations/create-from-template")]
    public async Task<IActionResult> CreateFinalReportFromTemplate()
    {
        var (code,message,stream) = await reportService.GetFinalReportAsync(UserId);
        switch (code)   
        {
            case 0:
                return this.File(
                    fileContents: stream.ToArray(), 
                    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 

                    // By setting a file download name the framework will
                    // automatically add the attachment Content-Disposition header
                    fileDownloadName: "ERSheet.xlsx"
                );
            case 1:
                return NotFound(message);
            default:
                return BadRequest(message);
        }
        
    }
}