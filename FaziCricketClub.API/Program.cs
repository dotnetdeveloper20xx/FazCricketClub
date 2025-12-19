using FaziCricketClub.API.Configuration;
using FaziCricketClub.API.Middleware;
using FaziCricketClub.API.Security;
using FaziCricketClub.Application;
using FaziCricketClub.Application.Validation.Seasons;
using FaziCricketClub.Infrastructure;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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

// ------------------------------------------------------------
// JWT CONFIGURATION
// ------------------------------------------------------------

// Bind Jwt settings from appsettings.json -> "Jwt".
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

if (jwtSettings == null)
{
    throw new InvalidOperationException("JWT settings are not configured for CricketClub.WebApi.");
}

if (string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException("JWT signing key is not configured for CricketClub.WebApi.");
}

// Create the signing key used to validate tokens from IdentityApi.
// This must be the SAME key as used to sign the tokens there.
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));

// ------------------------------------------------------------
// AUTHENTICATION + AUTHORIZATION
// ------------------------------------------------------------

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = signingKey,

            ValidateIssuer = true,
            ValidIssuer = jwtSettings.Issuer,

            ValidateAudience = true,
            ValidAudience = jwtSettings.Audience,

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

// Policy-based authorization using permission claims from JWT.
builder.Services.AddAuthorization(options =>
{
    // Feature-level policies (example for Players).
    options.AddPolicy("CanViewPlayers", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Players_View);
    });

    options.AddPolicy("CanEditPlayers", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Players_Edit);
    });

    // You can add similar policies for Teams, Fixtures, etc.
    options.AddPolicy("CanViewTeams", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Teams_View);
    });

    options.AddPolicy("CanEditTeams", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Teams_Edit);
    });

    options.AddPolicy("CanViewFixtures", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Fixtures_View);
    });

    options.AddPolicy("CanEditFixtures", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Fixtures_Edit);
    });
});


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

// IMPORTANT: authentication must come before authorization.
app.UseAuthentication();
app.UseAuthorization();

// Map attribute-routed controllers.
app.MapControllers();

app.Run();
