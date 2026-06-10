using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using NLog;
using NLog.Web;
using PairPrograming2.Repositories;
using PairPrograming2.Model;
using Scalar.AspNetCore;

var logger = NLog.LogManager.Setup()
    .LoadConfigurationFromFile("nlog.config").GetCurrentClassLogger();

var builder = WebApplication.CreateBuilder(args);

// NLog
builder.Logging.ClearProviders();
builder.Host.UseNLog();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddScoped<ISqlRepository, SqlRepository>();
builder.Services.AddProblemDetails();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var logger =
            context.HttpContext.RequestServices
                .GetRequiredService<ILogger<Program>>();

        logger.LogWarning(
            "リクエスト形式不正 Path:{Path}",
            context.HttpContext.Request.Path);

        return new BadRequestObjectResult(
            new ErrorRes("INVALID_REQUEST"));
    };
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        var exceptionFeature =
            context.Features.Get<IExceptionHandlerFeature>();

        var logger =
            context.RequestServices.GetRequiredService<ILogger<Program>>();

        if (exceptionFeature?.Error != null)
        {
            logger.LogError(
                exceptionFeature.Error,
                "未処理例外発生");
        }

        context.Response.StatusCode = 500;

        await context.Response.WriteAsJsonAsync(
            new ErrorRes("SYSTEM_ERROR"));
    });
});

app.MapControllers();

app.Run();
