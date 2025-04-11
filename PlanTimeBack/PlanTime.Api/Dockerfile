FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 9090

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PlanTime.Api/PlanTime.Api.csproj", "PlanTime.Api/"]
COPY ["PlanTime.Application/PlanTime.Application.csproj", "PlanTime.Application/"]
COPY ["PlanTime.Common/PlanTime.Common.csproj", "PlanTime.Common/"]
COPY ["PlanTime.Domain/PlanTime.Domain.csproj", "PlanTime.Domain/"]
COPY ["PlanTime.Infrastructure/PlanTime.Infrastructure.csproj", "PlanTime.Infrastructure/"]
COPY ["PlanTime.Models/PlanTime.Models.csproj", "PlanTime.Models/"]
RUN dotnet restore "PlanTime.Api/PlanTime.Api.csproj"
COPY . .
WORKDIR "/src/PlanTime.Api"
RUN dotnet build "PlanTime.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "PlanTime.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlanTime.Api.dll"]
