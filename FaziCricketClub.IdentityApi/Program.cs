using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------------------------------
// SERVICE REGISTRATION (Dependency Injection)
// ------------------------------------------------------------

// Add controllers so we can use full Web API controllers, not just minimal APIs.
builder.Services.AddControllers();

// Optional: Add API explorer + Swagger for easy testing of endpoints.
// Swagger is very useful while we develop and demo security flows.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// NOTE: We are NOT yet configuring Identity or authentication here.
// That will come in Step 2 and Step 3, so we keep this skeleton very simple.

var app = builder.Build();

// ------------------------------------------------------------
// MIDDLEWARE PIPELINE CONFIGURATION
// ------------------------------------------------------------

// In development, expose Swagger UI for easy manual testing.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enforce HTTPS in development and production.
app.UseHttpsRedirection();

// Authentication and authorization middlewares will be added later,
// once Identity and JWT bearer authentication are configured.
// For now, we comment them out to avoid confusion:
//
// app.UseAuthentication();
// app.UseAuthorization();

// Map controller routes.
app.MapControllers();

// Simple "ping" endpoint for quick health checks and smoke tests.
// This is purely for convenience in our learning/demo project.
app.MapGet("/ping", () => Results.Ok(new { status = "ok", service = "FaziCricketClub.IdentityApi" }))
   .WithName("Ping");
   

app.Run();


// ------------------------------------------------------------
// NOTES:
//
// 1. This project is intentionally minimal at this stage.
//    Our next steps will introduce IdentityDbContext, ApplicationUser,
//    Identity configuration, and JWT authentication.
//
// 2. Keeping the skeleton small makes it easy to reason about what
//    each change does as we add security features step by step.
// ------------------------------------------------------------
