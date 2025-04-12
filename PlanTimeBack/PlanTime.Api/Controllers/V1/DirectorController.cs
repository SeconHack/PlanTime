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
public class DirectorController(
    IVacationService vacationService,
    IRecordService recordService,
    IMinioRepository minioRepository,
    IAccountRepository accountRepository,
    IVacationRepository vacationRepository,
    IProfessionService professionService) : ApiControllerV1
{
    [HttpGet("vacations/export")]
    public async Task<IActionResult> ExportVacationsToMinio()
    {
        var vacations = await vacationService.GetAllVacationInfoAsync();

        if (vacations == null || vacations.Count == 0)
        {
            return BadRequest("Нет данных об отпусках для экспорта.");
        }

        var files = GenerateExcelFiles(vacations);


        const string bucketName = "vacations";
        await minioRepository.CreateBucketAsync(bucketName);
        const string folder = "2025";

        foreach (var (fileName, stream) in files)
        {
            stream.Position = 0;

            await minioRepository.UploadToFolderAsync(
                bucketName,
                folder,
                fileName,
                stream,
                stream.Length,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
        }

        return Ok("Все файлы успешно загружены в MinIO.");
    }


    private List<(string fileName, MemoryStream content)> GenerateExcelFiles(List<VacationInfo> vacations)
    {
        var grouped = vacations.GroupBy(v => v.DivisionName);
        var colors = new[]
        {
            XLColor.LightCoral,
            XLColor.LightBrown,
            XLColor.LightBlue,
            XLColor.LightPink,
            XLColor.LightSalmon,
            XLColor.LightSkyBlue,
            XLColor.LightYellow,
            XLColor.LightGray,
            XLColor.LightCyan,
            XLColor.LightGoldenrodYellow
        };

        var result = new List<(string, MemoryStream)>();

        foreach (var group in grouped)
        {
            var stream = new MemoryStream();
            using (var workbook = new XLWorkbook())
            {
                var sheetName = $"Подразделение {group.Key}";
                var worksheet = workbook.Worksheets.Add(sheetName);

                worksheet.Cell(1, 1).Value = "Фамилия";
                worksheet.Cell(1, 2).Value = "Подразделение";
                worksheet.Cell(1, 3).Value = "Дата начала отпуска";
                worksheet.Cell(1, 4).Value = "Дата конца отпуска";

                var sorted = group.OrderBy(v => v.VacationStartDate).ToList();
                var indexed = sorted.Select((v, i) => (v, row: i + 2)).ToList();

                foreach (var (v, row) in indexed)
                {
                    worksheet.Cell(row, 1).Value = v.LastName;
                    worksheet.Cell(row, 2).Value = v.DivisionName;
                    worksheet.Cell(row, 3).Value = v.VacationStartDate.ToString("dd.MM.yyyy");
                    worksheet.Cell(row, 4).Value = v.VacationEndDate.ToString("dd.MM.yyyy");
                }

                int n = indexed.Count;
                int[] groupNums = new int[n];
                int groupId = 1;

                for (int i = 0; i < n; i++)
                {
                    if (groupNums[i] != 0) continue;

                    var queue = new Queue<int>();
                    queue.Enqueue(i);
                    groupNums[i] = groupId;

                    while (queue.Count > 0)
                    {
                        int idx = queue.Dequeue();
                        var (vi, _) = indexed[idx];

                        for (int j = 0; j < n; j++)
                        {
                            if (groupNums[j] != 0) continue;

                            var (vj, _) = indexed[j];

                            bool overlap = vi.VacationStartDate <= vj.VacationEndDate &&
                                           vj.VacationStartDate <= vi.VacationEndDate;

                            if (overlap)
                            {
                                groupNums[j] = groupId;
                                queue.Enqueue(j);
                            }
                        }
                    }

                    groupId++;
                }

                var groupCounts = new Dictionary<int, int>();
                foreach (var g in groupNums)
                {
                    if (g == 0) continue;
                    if (!groupCounts.ContainsKey(g)) groupCounts[g] = 0;
                    groupCounts[g]++;
                }

                for (int i = 0; i < n; i++)
                {
                    int g = groupNums[i];
                    if (g == 0 || groupCounts[g] < 2) continue;

                    var (_, row) = indexed[i];
                    var color = colors[(g - 1) % colors.Length];
                    worksheet.Range(row, 1, row, 4).Style.Fill.BackgroundColor = color;
                }

                worksheet.Columns().AdjustToContents();
                workbook.SaveAs(stream);
            }

            stream.Position = 0;

            // Убрать недопустимые символы из названия файла
            var safeFileName = string.Concat(group.Key.Split(Path.GetInvalidFileNameChars()));
            result.Add(($"Подразделение_{safeFileName}.xlsx", stream));
        }

        return result;
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

        var vacations = await vacationService.GetAllVacationInfoAsync();
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
                    vacation.LastName + user.FirstName + user.MiddleName; // ФИО
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