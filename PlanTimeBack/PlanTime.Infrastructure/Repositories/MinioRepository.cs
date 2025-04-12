using Minio;
using Minio.DataModel.Args;
using PlanTime.Domain.Repositories;

namespace PlanTime.Infrastructure.Repositories;

public class MinioRepository(IMinioClient minioClient) : IMinioRepository
{
    public async Task<bool> BucketExistsAsync(string bucketName)
    {
        return await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(bucketName));
    }

    public async Task CreateBucketAsync(string bucketName)
    {
        if (!await BucketExistsAsync(bucketName))
        {
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(bucketName));
        }
    }

    public async Task UploadObjectAsync(string bucketName, string objectName, Stream data, long size, string contentType)
    {
        await minioClient.PutObjectAsync(new PutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectName)
            .WithStreamData(data)
            .WithObjectSize(size)
            .WithContentType(contentType));
    }

    public async Task<string> GetPresignedUrlAsync(string bucketName, string objectName, int expiryInSeconds)
    {
        return await minioClient.PresignedGetObjectAsync(new PresignedGetObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectName)
            .WithExpiry(expiryInSeconds));
    }

    public async Task DeleteObjectAsync(string bucketName, string objectName)
    {
        await minioClient.RemoveObjectAsync(new RemoveObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectName));
    }

    public async Task<Stream> GetRecordAsync(string bucketName, string objectName)
    {
        var stream = new MemoryStream();

        await minioClient.GetObjectAsync(new GetObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectName)
            .WithCallbackStream(s => s.CopyToAsync(stream)));

        stream.Position = 0;
        return stream;
    }

    public async Task UploadToFolderAsync(string bucketName, string folderName, string fileName, Stream data, long size, string contentType)
    {
        var objectName = $"{folderName.TrimEnd('/')}/{fileName}";

        await minioClient.PutObjectAsync(new PutObjectArgs()
            .WithBucket(bucketName)
            .WithObject(objectName)
            .WithStreamData(data)
            .WithObjectSize(size)
            .WithContentType(contentType));
    }
}
