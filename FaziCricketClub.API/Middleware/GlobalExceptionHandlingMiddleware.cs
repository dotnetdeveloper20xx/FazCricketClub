using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;

namespace FaziCricketClub.API.Middleware
{
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

        public GlobalExceptionHandlingMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                var correlationId = context.Items[CorrelationIdMiddleware.CorrelationIdItemKey] as string;

                _logger.LogError(
                    ex,
                    "Unhandled exception processing {Method} {Path} with CorrelationId={CorrelationId}",
                    context.Request?.Method,
                    context.Request?.Path.Value,
                    correlationId);

                await WriteProblemDetailsResponseAsync(context, ex, correlationId);
            }
        }

        private static async Task WriteProblemDetailsResponseAsync(
            HttpContext context,
            Exception exception,
            string? correlationId)
        {
            if (context.Response.HasStarted)
            {
                return;
            }

            context.Response.Clear();
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            context.Response.ContentType = "application/problem+json";

            var problem = new ProblemDetails
            {
                Status = context.Response.StatusCode,
                Title = "An unexpected error occurred.",
                Detail = "An unexpected error occurred while processing the request.",
                Instance = context.Request?.Path.Value
            };

            if (!string.IsNullOrWhiteSpace(correlationId))
            {
                problem.Extensions["correlationId"] = correlationId;
            }

            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };

            var json = JsonSerializer.Serialize(problem, options);
            await context.Response.WriteAsync(json);
        }
    }
}
