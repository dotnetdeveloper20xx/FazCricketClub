using FaziCricketClub.API.Configuration;
using FaziCricketClub.API.Middleware;
using FaziCricketClub.API.Security;
using FaziCricketClub.Application;
using FaziCricketClub.Application.Validation.Seasons;
using FaziCricketClub.Infrastructure;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Rate limiting configuration
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    // Global rate limit: 200 requests per minute per IP
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(httpContext =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: httpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 200,
                Window = TimeSpan.FromMinutes(1),
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0
            }));
});

// CORS configuration - allow Angular frontend and other trusted origins
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",
                "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });

    options.AddPolicy("Production", policy =>
    {
        // In production, configure specific origins from appsettings
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>();
        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            policy.WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "FazCricketClub API",
        Version = "v1",
        Description = "Cricket Club Management System API"
    });

    // Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' followed by a space and then your JWT token. Example: 'Bearer eyJhbGc...'"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

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

// ------------------------------------------------------------
// SEED MAIN DATABASE (DEVELOPMENT ONLY)
// ------------------------------------------------------------

using (var scope = app.Services.CreateScope())
{
    // Seed main database (only in Development)
    if (app.Environment.IsDevelopment())
    {
        var mainSeeder = scope.ServiceProvider.GetRequiredService<FaziCricketClub.Infrastructure.Persistence.MainDatabaseSeeder>();
        await mainSeeder.SeedAllAsync(clearExisting: false); // Only seed if data doesn't exist
    }
}

// Security headers should be added early
app.UseSecurityHeaders();

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

// Rate limiting should come early in the pipeline
app.UseRateLimiter();

// CORS must come before authentication
if (app.Environment.IsDevelopment())
{
    app.UseCors("AllowAngularDev");
}
else
{
    app.UseCors("Production");
}

// IMPORTANT: authentication must come before authorization.
app.UseAuthentication();
app.UseAuthorization();

// Map attribute-routed controllers.
app.MapControllers();

app.Run();
