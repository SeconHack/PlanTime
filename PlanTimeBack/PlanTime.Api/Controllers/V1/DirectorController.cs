using System.IO.Compression;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlanTime.Api.Controllers.Abstract;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Models.Vacations;

namespace PlanTime.Api.Controllers.V1;

[Route("api/[controller]")]
public class DirectorController(IVacationService vacationService, IRecordService recordService) : ApiControllerV1
{
    [HttpGet("vacations/export")]
    public async Task<IActionResult> ExportVacationsToExcel()
    {
        var vacations = await vacationService.GetAllVacationInfoAsync();

        if (vacations == null || vacations.Count == 0)
        {
            return BadRequest("Нет данных об отпусках для экспорта.");
        }

        var files = GenerateExcelFiles(vacations);

        var zipStream = new MemoryStream();
        using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, leaveOpen: true))
        {
            foreach (var (fileName, content) in files)
            {
                var entry = archive.CreateEntry(fileName);
                using var entryStream = entry.Open();
                content.Position = 0;
                await content.CopyToAsync(entryStream);
            }
        }

        await recordService.AddAsync(zipStream);
        zipStream.Position = 0;
        return File(zipStream, "application/zip", "vacations_by_departments.zip");
    }

    private List<(string fileName, MemoryStream content)> GenerateExcelFiles(List<VacationInfo> vacations)
    {
        var grouped = vacations.GroupBy(v => v.DivisionName);
        var colors = new[]
        {
            XLColor.LightCoral,
            XLColor.LightGreen,
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
}