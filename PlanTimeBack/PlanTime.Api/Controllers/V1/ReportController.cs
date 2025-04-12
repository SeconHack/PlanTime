using System.IO.Compression;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        var res = await reportService.GetIntersectionsAsync(UserId);
        return res;
    }
    [HttpDelete("vacations/{vocationId}")]
    public async Task<IActionResult> DeleteVocationWithInfo(int vocationId)
    {
        
        return Ok("");
    }

    [HttpPost("vacations/create-from-template")]
    public async Task<IActionResult> CreateFinalReportFromTemplate()
    {
        const string bucketName = "vacations";
        const string templateFileName = "graphics.xlsx";
        const string targetFolder = "2025_финальные_отчеты";

        // Получаем шаблон из MinIO
        var templateStream = await minioRepository.GetFileAsync(bucketName, templateFileName);
        if (templateStream == null)
            return NotFound("Шаблонный файл не найден в MinIO.");
        var account = await accountRepository.GetByIdAsync(UserId);
        var vacations = await vacationService.GetVacationInfoByDivisionIdAsync(account.DivisionId);
        if (vacations == null || vacations.Count == 0)
            return BadRequest("Нет данных для формирования отчета.");

        // Группируем отпуска по подразделениям
        var groupedVacations = vacations.GroupBy(v => v.DivisionName);

        foreach (var group in groupedVacations)
        {
            var divisionName = group.Key;
            var safeDivisionName = string.Concat(divisionName.Split(Path.GetInvalidFileNameChars()));
            var finalFileName = $"финальный_отчет_{safeDivisionName}.xlsx";

            // Копия шаблона для каждого подразделения
            var localTemplateStream = new MemoryStream();
            templateStream.Position = 0;
            await templateStream.CopyToAsync(localTemplateStream);
            localTemplateStream.Position = 0;

            using var workbook = new XLWorkbook(localTemplateStream);
            var worksheet = workbook.Worksheets.FirstOrDefault() ?? workbook.Worksheets.Add("Sheet1");

            int startRow = 28;
            int startColumn = 2;

            foreach (var vacation in group)
            {
                var user = await accountRepository.GetByIdAsync(vacation.UserId);
                var profession = await professionService.GetById(user.ProfessionId);

                worksheet.Cell(startRow, startColumn).Value = vacation.DivisionName; // Подразделение
                worksheet.Cell(startRow, startColumn + 1).Value = profession?.ProfessionName ?? ""; // Должность
                worksheet.Cell(startRow, startColumn + 2).Value =
                    vacation.Email + user.FirstName + user.MiddleName; // ФИО
                worksheet.Cell(startRow, startColumn + 3).Value = ""; // Табельный номер
                worksheet.Cell(startRow, startColumn + 4).Value =
                    (vacation.VacationEndDate - vacation.VacationStartDate).Days + 1; // Кол-во дней
                worksheet.Cell(startRow, startColumn + 5).Value = ""; // Доп. отпуск
                worksheet.Cell(startRow, startColumn + 6).Value = ""; // Итого
                worksheet.Cell(startRow, startColumn + 7).Value = vacation.VacationStartDate.ToString("dd.MM.yyyy") +
                                                                  " - " + vacation.VacationEndDate.ToString(
                                                                      "dd.MM.yyyy"); // Запланированная дата
                worksheet.Cell(startRow, startColumn + 8).Value = vacation.VacationStartDate.ToString("dd.MM.yyyy") +
                                                                  " - " + vacation.VacationEndDate.ToString(
                                                                      "dd.MM.yyyy"); // Фактическая дата
                worksheet.Cell(startRow, startColumn + 9).Value = ""; // Основание
                worksheet.Cell(startRow, startColumn + 10).Value = ""; // Предполагаемая дата
                worksheet.Cell(startRow, startColumn + 11).Value = ""; // Примечание

                startRow++;
            }

            worksheet.Columns().AdjustToContents();

            var output = new MemoryStream();
            workbook.SaveAs(output);
            output.Position = 0;

            await minioRepository.UploadToFolderAsync(
                bucketName,
                targetFolder,
                finalFileName,
                output,
                output.Length,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        }

        return Ok("Финальные отчёты успешно созданы и загружены в MinIO.");
    }
}