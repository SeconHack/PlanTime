namespace PlanTime.Domain.Repositories;

public interface IMinioRepository
{
    Task<bool> BucketExistsAsync(string bucketName);
    Task CreateBucketAsync(string bucketName);
    Task UploadObjectAsync(string bucketName, string objectName, Stream data, long size, string contentType);
    Task<string> GetPresignedUrlAsync(string bucketName, string objectName, int expiryInSeconds);
    Task DeleteObjectAsync(string bucketName, string objectName);
    Task<Stream> GetRecordAsync(string bucketName, string objectName);
}