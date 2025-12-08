using FaziCricketClub.API.Middleware;
using FaziCricketClub.Application;
using FaziCricketClub.Application.Validation.Seasons;
using FaziCricketClub.Infrastructure;
using FluentValidation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Automatically register all validators in the Application assembly
builder.Services.AddValidatorsFromAssemblyContaining<CreateSeasonDtoValidator>();

// Register application-layer services.
builder.Services.AddApplication();

// Register infrastructure-layer services (DbContext, repositories, etc.).
builder.Services.AddInfrastructure(builder.Configuration);

var app = builder.Build();

// Global exception handling should be one of the first middlewares
app.UseCorrelationId();
app.UseGlobalExceptionHandling();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

// Map attribute-routed controllers.
app.MapControllers();

app.Run();
