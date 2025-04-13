using ClosedXML.Excel;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services;

public class ReportService(
    IAccountRepository accountRepository,
    IDivisionRepository divisionRepository,
    IMinioRepository minioRepository,
    IVacationService vacationService,
    IVacationRepository vacationRepository,
    IMailServiceSender mailServiceSender,
    ICommunicationsRepository communicationsRepository,
    IProfessionRepository professionRepository) : IReportService
{
    const string BucketName = "vacations";

    //метод для создания и отправики чернового отчёта на сервер
    private async Task<(string fileName, MemoryStream content)> GenerateExcelFile(string divisionName, int divisionId,
        List<VacationInfo> vacations)
    {
        var stream = new MemoryStream();
        using (var workbook = new XLWorkbook())
        {
            var sheetName = "list1";
            int rowIndex = 1;
            var worksheet = workbook.Worksheets.Add(sheetName);

            worksheet.Cell(rowIndex, 1).Value = "id отпуска";
            worksheet.Cell(rowIndex, 2).Value = "почта";
            worksheet.Cell(rowIndex, 3).Value = "Подразделение";
            worksheet.Cell(rowIndex, 4).Value = "Дата начала отпуска";
            worksheet.Cell(rowIndex, 5).Value = "Дата конца отпуска";
            rowIndex++;
            var sorted = vacations.OrderBy(v => v.VacationStartDate).ToList();
            var indexed = sorted.Select((v, i) => (v, row: i + 2)).ToList();
            foreach (var (v, row) in indexed)
            {
                rowIndex++;
                worksheet.Cell(row, 1).Value = v.VacationId;
                worksheet.Cell(row, 2).Value = v.Email;
                worksheet.Cell(row, 3).Value = v.DivisionName;
                worksheet.Cell(row, 4).Value = v.VacationStartDate.ToString("dd.MM.yyyy");
                worksheet.Cell(row, 5).Value = v.VacationEndDate.ToString("dd.MM.yyyy");
            }

            var communications = await communicationsRepository.GetByParentIdAsync(divisionId);
            foreach (var communication in communications)
            {
                var child = await divisionRepository.GetByIdAsync(communication.ChildId);
                var tmpName = string.Concat(child.DivisionName.Split(Path.GetInvalidFileNameChars()));
                tmpName = $"Подразделение {tmpName}.xlsx";
                var objectName = $"{"2025".TrimEnd('/')}/{tmpName}";
                Console.WriteLine(objectName);
                var file = await minioRepository.GetFileAsync(BucketName, objectName);
                if (file != null)
                {
                    Console.WriteLine("in");
                    var newBook = new XLWorkbook(file);
                    var newworksheet = newBook.Worksheet(1);
                    // получим все строки в файле
                    var rows = newworksheet.RangeUsed().RowsUsed(); // Skip header row
                    // пример чтения строк файла.
                    bool firstRow = true;
                    foreach (var row in rows)
                    {
                        if (firstRow)
                        {
                            firstRow = false;
                            continue;
                        }

                        worksheet.Cell(rowIndex, 1).Value = row.Cell(1).Value;
                        worksheet.Cell(rowIndex, 2).Value = row.Cell(2).Value;
                        worksheet.Cell(rowIndex, 3).Value = row.Cell(3).Value;
                        worksheet.Cell(rowIndex, 4).Value = row.Cell(4).Value;
                        worksheet.Cell(rowIndex, 5).Value = row.Cell(5).Value;
                        rowIndex++;
                    }
                }

            }

            worksheet.Columns().AdjustToContents();
            workbook.SaveAs(stream);
        }

        stream.Position = 0;

        // Убрать недопустимые символы из названия файла
        var safeFileName = string.Concat(divisionName.Split(Path.GetInvalidFileNameChars()));

        return ($"Подразделение {safeFileName}.xlsx", stream);
    }
    //метод длля вывода пересечений отпусков по спискам
    public async Task<List<List<VacationInfo>>> GetIntersectionsAsync(int userId)
    {
        var user = await accountRepository.GetByIdAsync(userId);
        var vacations = await vacationService.GetVacationInfoByDivisionIdAsync(user.DivisionId);
        var divisionName = vacations[0].DivisionName;
        List<List<VacationInfo>> result = new List<List<VacationInfo>>();
        while (vacations.Count > 0)
        {
            List<VacationInfo> vacationInfos = new List<VacationInfo>();
            vacationInfos.Add(vacations[0]);
            vacations.RemoveAt(0);
            DateTime startDate = vacationInfos[0].VacationStartDate;
            DateTime endDate = vacationInfos[0].VacationEndDate;
            for (int j = 0; j < vacations.Count; j++)
                if (endDate >= vacations[j].VacationStartDate &&
                    startDate <= vacations[j].VacationStartDate)
                {
                    endDate = vacations[j].VacationEndDate;
                    vacationInfos.Add(vacations[j]);
                    vacations.RemoveAt(j);
                    j--;

                }

            if (vacationInfos.Count > 1)
                result.Add(vacationInfos);
        }

        return result;
    }

    public async Task<(int, string)> SaveReportAsync(int userId)
    {
        var user = await accountRepository.GetByIdAsync(userId);
        var vacations = await vacationService.GetVacationInfoByDivisionIdAsync(user.DivisionId);
        var division = await divisionRepository.GetByIdAsync(user.DivisionId);
        if (vacations.Count == 0)
        {
            return (1, "Нет данных об отпусках для экспорта.");
        }


        var (fileName, stream) = await GenerateExcelFile(division.DivisionName, division.Id, vacations);

        await minioRepository.CreateBucketAsync(BucketName);
        const string folder = "2025";





        stream.Position = 0;

        await minioRepository.UploadToFolderAsync(
            BucketName,
            folder,
            fileName,
            stream,
            stream.Length,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        return (0, "success");
    }

    public async Task DeleteVocationWithNotificationAsync(int vacationId)
    {
        var vacation = await vacationRepository.GetByIdAsync(vacationId);
        int dayCouns = vacation.EndDate.Day - vacation.StartDate.Day;
        var user = await accountRepository.GetByIdAsync(vacation.UserId);
        user.CountVacationDays += dayCouns;
        await accountRepository.UpdateAsync(user, user.Id);
        await vacationRepository.DeleteAsync(vacationId);
        mailServiceSender.SendMail(user.Email, "Необходимо обновить данные",
            "Руководитель убрал ваш отпуск. Пожалуйста выберете новую дату");
    }

    public async Task<(int, string, MemoryStream)> GetFinalReportAsync(int userId)
    {
        const string bucketName = "vacations";
        const string templateFileName = "graphics.xlsx";
        const string targetFolder = "2025_финальные_отчеты";

        // Получаем шаблон из MinIO
        var templateStream = await minioRepository.GetFileAsync(bucketName, templateFileName);
        if (templateStream == null)
            return (2, "Шаблонный файл не найден в MinIO.", null);
        var account = await accountRepository.GetByIdAsync(userId);
        var division = await divisionRepository.GetByIdAsync(account.DivisionId);
        using var workbook = new XLWorkbook(templateStream);
        var worksheet = workbook.Worksheets.FirstOrDefault() ?? workbook.Worksheets.Add("Sheet1");

        int startRow = 28;
        int startColumn = 2;

        var tmpName = string.Concat(division.DivisionName.Split(Path.GetInvalidFileNameChars()));
        tmpName = $"Подразделение {tmpName}.xlsx";
        var objectName = $"{"2025".TrimEnd('/')}/{tmpName}";
        var file = await minioRepository.GetFileAsync(BucketName, objectName);
        string endString = worksheet.Cell("B"+28).Value.ToString();
        string endStringfio = worksheet.Cell("I"+28).Value.ToString();
        worksheet.Cell("B" + 28).Value = "";
        worksheet.Cell("I" + 28).Value = "";
        if (file != null)
        {
            var newBook = new XLWorkbook(file);
            var newworksheet = newBook.Worksheet(1);
            // получим все строки в файле
            var rows = newworksheet.RangeUsed().RowsUsed();
            // пример чтения строк файла.
            bool firstRow = true;
            int rowIndex = 1;
            foreach (var row in rows)
            {
                if (firstRow)
                {
                    firstRow = false;
                    continue;
                }
                Console.WriteLine(Convert.ToInt32(row.Cell(1).Value.ToString()));
                var vacation = await vacationRepository.GetByIdAsync(Convert.ToInt32(row.Cell(1).Value.ToString()));
                if (vacation == null)
                    return (2,"Данные о отпуске устарели. Обновите отчёты ниже по иерархии", null);
                var tmpuset = await accountRepository.GetByIdAsync(vacation.UserId);
                var profesion = await professionRepository.GetByIdAsync(tmpuset.ProfessionId);
                worksheet.Cell(startRow, startColumn-1).Value = rowIndex++; // Подразделение
                worksheet.Cell(startRow, startColumn).Value = division.DivisionName; // Подразделение
                worksheet.Cell(startRow, startColumn + 1).Value = profesion.ProfessionName; // Должность
                worksheet.Cell(startRow, startColumn + 2).Value =
                    tmpuset.LastName + " " + tmpuset.FirstName + " " + tmpuset.MiddleName; // ФИО
                worksheet.Cell(startRow, startColumn + 3).Value = ""; // Табельный номер
                worksheet.Cell(startRow, startColumn + 4).Value =
                    (vacation.EndDate - vacation.StartDate).Days + 1; // Кол-во дней
                worksheet.Cell(startRow, startColumn + 5).Value = ""; // Доп. отпуск
                worksheet.Cell(startRow, startColumn + 6).Value = ""; // Итого
                worksheet.Cell(startRow, startColumn + 7).Value =
                    vacation.StartDate.ToString("dd.MM.yyyy"); // Запланированная дата
                worksheet.Cell(startRow, startColumn + 8).Value =
                    vacation.StartDate.ToString("dd.MM.yyyy"); // Фактическая дата
                worksheet.Cell(startRow, startColumn + 9).Value = ""; // Основание
                worksheet.Cell(startRow, startColumn + 10).Value = ""; // Предполагаемая дата
                worksheet.Cell(startRow, startColumn + 11).Value = ""; // Примечание
                worksheet.Cell(startRow, startColumn -1).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 1).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 2).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 3).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 4).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 5).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 6).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 7).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 8).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 9).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 10).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                worksheet.Cell(startRow, startColumn + 11).Style.Border.OutsideBorder = XLBorderStyleValues.Thin;

                startRow++;
            }
            startRow+=3;
            worksheet.Cell(startRow, 2).Value = endString; // Предполагаемая дата
            worksheet.Cell(startRow, 9).Value = endStringfio; // Примечание
        }
        else
            return (1, "нет файла для отчёта", null);
        // Группируем отпуска по подразделениям


        var output = new MemoryStream();
        workbook.SaveAs(output);
        output.Position = 0;
        
        var safeDivisionName = string.Concat(division.DivisionName.Split(Path.GetInvalidFileNameChars()));
        var finalFileName = $"финальный_отчет_{safeDivisionName}.xlsx";
        await minioRepository.UploadToFolderAsync(
            bucketName,
            targetFolder,
            finalFileName,
            output,
            output.Length,
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        return (0, "success", output);
    }
}