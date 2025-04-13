using ClosedXML.Excel;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services;

public class ReportService(IAccountRepository accountRepository,
    IDivisionRepository divisionRepository,
    IMinioRepository minioRepository,
    IVacationService vacationService,IVacationRepository vacationRepository,
    IMailServiceSender mailServiceSender, ICommunicationsRepository communicationsRepository) :IReportService
{
    const string BucketName = "vacations";
    private async Task<(string fileName, MemoryStream content)> GenerateExcelFile(string divisionName,int divisionId,List<VacationInfo> vacations)
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
                var child =await divisionRepository.GetByIdAsync(communication.ChildId);
                var file = await minioRepository.GetFileAsync(BucketName, child.DivisionName);
                if (file != null)
                {
                    var newBook = new XLWorkbook(file);
                    
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
            int indMax = 0;
            for(int j = 0 ; j < vacations.Count; j++)
                if (vacationInfos[indMax].VacationEndDate > vacations[j].VacationStartDate&&
                    vacationInfos[indMax].VacationEndDate < vacations[j].VacationStartDate)
                {
                    indMax++;
                    vacationInfos.Add(vacations[j]);
                    vacations.RemoveAt(j);
                    j--;

                }
            if(vacationInfos.Count != 1)
                result.Add(vacationInfos);
        }

                    
        
        result.Add(vacations.Where(v=>v.DivisionName==divisionName).ToList());
        vacations.RemoveAll(v => v.DivisionName==divisionName);
        return result;
    }
    public async Task<(int,string)> SaveReportAsync(int userId)
    {
        var user = await accountRepository.GetByIdAsync(userId);
        var vacations = await vacationService.GetVacationInfoByDivisionIdAsync(user.DivisionId);
        var division = await divisionRepository.GetByIdAsync(user.DivisionId);
        if (vacations.Count == 0)
        {
            return (1,"Нет данных об отпусках для экспорта.");
        }
        

        var (fileName, stream) = await GenerateExcelFile(division.DivisionName,division.Id, vacations);
        
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
        return (0,"success");
    }

    public async Task DeleteVocationWithNotificationAsync(int vacationId)
    {
        var vacation = await vacationRepository.GetByIdAsync(vacationId);
        int dayCouns = vacation.EndDate.Day - vacation.StartDate.Day;
        var user = await accountRepository.GetByIdAsync(vacation.UserId);
        user.CountVacationDays+=dayCouns;
        await accountRepository.UpdateAsync(user,user.Id);
        await vacationRepository.DeleteAsync(vacationId);
        mailServiceSender.SendMail(user.Email,"Необходимо обновить данные",
            "Руководитель убрал ваш отпуск. Пожалуйста выберете новую дату");
    }
}