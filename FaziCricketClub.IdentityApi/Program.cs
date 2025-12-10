using FaziCricketClub.IdentityApi.Configuration;
using FaziCricketClub.IdentityApi.Data;
using FaziCricketClub.IdentityApi.Entities;
using FaziCricketClub.IdentityApi.Infrastructure;
using FaziCricketClub.IdentityApi.Security;
using FaziCricketClub.IdentityApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// CONFIGURATION BINDING
// ------------------------------------------------------------

// Bind Jwt settings from configuration (appsettings.json -> "Jwt").
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>();

if (jwtSettings == null)
{
    // Fail fast if JWT configuration is missing.
    // ReSharper disable once ThrowingSystemException
    throw new InvalidOperationException("JWT settings are not configured in appsettings.json.");
}

if (string.IsNullOrWhiteSpace(jwtSettings.Key))
{
    throw new InvalidOperationException("JWT signing key is not configured in appsettings.json.");
}

// ------------------------------------------------------------
// DATABASE + IDENTITY
// ------------------------------------------------------------

var connectionString = builder.Configuration.GetConnectionString("IdentityConnection");

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException(
        "Connection string 'IdentityConnection' is not configured. " +
        "Please add it to appsettings.json or user secrets.");
}

builder.Services.AddDbContext<CricketClubIdentityDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});

// Configure ASP.NET Core Identity for ApplicationUser/ApplicationRole.
builder.Services
    .AddIdentityCore<ApplicationUser>(options =>
    {
        // Password rules – adjust as needed for your security policy.
        options.Password.RequireDigit = true;
        options.Password.RequireLowercase = true;
        options.Password.RequireUppercase = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequiredLength = 8;

        // Lockout rules to mitigate brute-force attacks.
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;

        // User settings.
        options.User.RequireUniqueEmail = true;
    })
    .AddRoles<ApplicationRole>() // Enable role support.
    .AddEntityFrameworkStores<CricketClubIdentityDbContext>()
    .AddSignInManager<SignInManager<ApplicationUser>>() // Required for login checks.
    .AddDefaultTokenProviders();

builder.Services.AddScoped<ITokenService, JwtTokenService>();

// ------------------------------------------------------------
// AUTHENTICATION + AUTHORIZATION
// ------------------------------------------------------------

// Configure JWT bearer authentication.
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key));


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

builder.Services.AddAuthorization(options =>
{
    // Policy: user must have Admin.ManageUsers permission.
    options.AddPolicy("CanManageUsers", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Admin_ManageUsers);
    });

    // Policy: user must have Admin.ManageRoles permission.
    options.AddPolicy("CanManageRoles", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Admin_ManageRoles);
    });

    // Policy: user must have Admin.ManagePermissions permission.
    options.AddPolicy("CanManagePermissions", policy =>
    {
        policy.RequireAuthenticatedUser();
        policy.RequireClaim("permission", AppPermissions.Admin_ManagePermissions);
    });

    // You can add more fine-grained policies later, e.g.:
    // options.AddPolicy("CanEditPlayers", p => p.RequireClaim("permission", AppPermissions.Players_Edit));
});

// ------------------------------------------------------------
// APPLICATION SERVICES
// ------------------------------------------------------------

// Register the JWT token service.
builder.Services.AddScoped<ITokenService, JwtTokenService>();

// Add controllers and Swagger.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ------------------------------------------------------------
// SEED IDENTITY DATA (ROLES + PERMISSIONS)
// ------------------------------------------------------------

using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<IdentityDataSeeder>();
    await seeder.SeedAsync();
}


// ------------------------------------------------------------
// MIDDLEWARE PIPELINE
// ------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Order is important: authentication before authorization.
app.UseAuthentication();
app.UseAuthorization();

// Map controller routes.
app.MapControllers();

// Simple unauthenticated health endpoint.
app.MapGet("/ping", () => Results.Ok(new
{
    status = "ok",
    service = "CricketClub.IdentityApi",
    auth = "jwt-configured"
}))
   .WithName("Ping");

app.Run();
