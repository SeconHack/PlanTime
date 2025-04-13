﻿using ClosedXML.Excel;
using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Repositories;
using PlanTime.Models.Vacations;

namespace PlanTime.Application.Services;

public class ReportService(IAccountRepository accountRepository,
    IDivisionRepository divisionRepository,
    IMinioRepository minioRepository,
    IVacationService vacationService,IVacationRepository vacationRepository,
    IMailServiceSender mailServiceSender) :IReportService
{
    private (string fileName, MemoryStream content) GenerateExcelFile(string divisionName,List<VacationInfo> vacations)
    {
        var stream = new MemoryStream();
        using (var workbook = new XLWorkbook())
        {
            var sheetName = "list1";
            var worksheet = workbook.Worksheets.Add(sheetName);
            
            worksheet.Cell(1, 1).Value = "id отпуска";
            worksheet.Cell(1, 2).Value = "почта";
            worksheet.Cell(1, 3).Value = "Подразделение";
            worksheet.Cell(1, 4).Value = "Дата начала отпуска";
            worksheet.Cell(1, 5).Value = "Дата конца отпуска";

            var sorted = vacations.OrderBy(v => v.VacationStartDate).ToList();
            var indexed = sorted.Select((v, i) => (v, row: i + 2)).ToList();
            foreach (var (v, row) in indexed)
            {
                worksheet.Cell(row, 1).Value = v.VacationId;
                worksheet.Cell(row, 2).Value = v.Email;
                worksheet.Cell(row, 3).Value = v.DivisionName;
                worksheet.Cell(row, 4).Value = v.VacationStartDate.ToString("dd.MM.yyyy");
                worksheet.Cell(row, 5).Value = v.VacationEndDate.ToString("dd.MM.yyyy");
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
        List<List<VacationInfo>> result = new List<List<VacationInfo>>();
        for (int i = 0; i < vacations.Count; i++)
        {
            List<VacationInfo> vacationInfos = new List<VacationInfo>();
            vacationInfos.Add(vacations[i]);
            vacations.RemoveAt(i);
            int indMax = i;
            for(int j = i ; j < vacations.Count; j++)
                if (vacations[indMax].VacationEndDate > vacations[j].VacationEndDate)
                {
                    indMax = j;
                    vacationInfos.Add(vacations[j]);
                    vacations.RemoveAt(j--);
                    
                }
            if(vacationInfos.Count != 1)
                result.Add(vacationInfos);
                
        }

                    
        var divisionName = vacations[0].DivisionName;
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
        

        var (fileName, stream) = GenerateExcelFile(division.DivisionName, vacations);
        const string bucketName = "vacations";
        await minioRepository.CreateBucketAsync(bucketName);
        const string folder = "2025";


        stream.Position = 0;

        await minioRepository.UploadToFolderAsync(
            bucketName,
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