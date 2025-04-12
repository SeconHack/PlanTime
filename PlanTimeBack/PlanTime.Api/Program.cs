using PlanTime.Api.Extensions;
using PlanTime.Api.Middleware;
using PlanTime.Application.Services;
using PlanTime.Application.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

builder.Services.AddRouting(options => options.LowercaseUrls = true);

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerWithAuth();

builder.Services.AddMinio();
builder.Services.AddDapper();
builder.Services.MigrateDatabase(configuration);

builder.Services.AddAuthModule();
builder.Services.AddJwtAuth(builder.Configuration);

builder.Services.AddInfrastructure();
builder.Services.AddApplication();

builder.Services.AddTransient<ExceptionHandlingMiddleware>();
builder.Services.AddScoped<IVacationService, VacationService>();
var app = builder.Build();


app.UseSwagger();
app.UseSwaggerUI();

app.UseAuthorization();
app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapControllers();

app.Run();