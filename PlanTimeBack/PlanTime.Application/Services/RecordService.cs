using PlanTime.Application.Services.Interfaces;
using PlanTime.Domain.Repositories;

namespace PlanTime.Application.Services;

public class RecordService(IMinioRepository minioRepository) : IRecordService
{
    private const string BucketName = "Record";
    
    public async Task<bool> AddAsync(Stream stream)
    {
        if (!await minioRepository.BucketExistsAsync(BucketName))
            await minioRepository.CreateBucketAsync(BucketName);

        var objectName = $"Record_{DateTime.Now.Date}";
        await minioRepository.UploadObjectAsync(BucketName, objectName, stream, stream.Length, "xlsx");
        
        return true;
    }
}