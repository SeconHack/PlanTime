FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["PlanTimeBack.Api/PlanTimeBack.Api.csproj", "PlanTimeBack.Api/"]
RUN dotnet restore "PlanTimeBack.Api/PlanTimeBack.Api.csproj"
COPY . .
WORKDIR "/src/PlanTimeBack.Api"
RUN dotnet build "PlanTimeBack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "PlanTimeBack.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PlanTimeBack.Api.dll"]
