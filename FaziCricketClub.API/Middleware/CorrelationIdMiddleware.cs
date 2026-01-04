namespace FaziCricketClub.API.Middleware
{
    /// <summary>
    /// Ensures every request has a correlation ID.
    /// - Reads X-Correlation-Id from the incoming request, or generates a new one.
    /// - Stores it in HttpContext.Items["CorrelationId"].
    /// - Adds it to the response headers.
    /// </summary>
    public class CorrelationIdMiddleware
    {
        public const string CorrelationIdHeaderName = "X-Correlation-Id";
        public const string CorrelationIdItemKey = "CorrelationId";

        private readonly RequestDelegate _next;
        private readonly ILogger<CorrelationIdMiddleware> _logger;

        public CorrelationIdMiddleware(
            RequestDelegate next,
            ILogger<CorrelationIdMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Try to read an incoming correlation ID, otherwise generate a new one.
            string correlationId;

            if (context.Request.Headers.TryGetValue(CorrelationIdHeaderName, out var headerValues)
                && !string.IsNullOrWhiteSpace(headerValues.FirstOrDefault()))
            {
                correlationId = headerValues.FirstOrDefault() ?? Guid.NewGuid().ToString();
            }
            else
            {
                correlationId = Guid.NewGuid().ToString();
            }

            // Store it on the context so other components can access it.
            context.Items[CorrelationIdItemKey] = correlationId;

            // Also add it to the response headers.
            context.Response.OnStarting(() =>
            {
                context.Response.Headers[CorrelationIdHeaderName] = correlationId;
                return Task.CompletedTask;
            });

            _logger.LogDebug("Handling request {Method} {Path} with CorrelationId={CorrelationId}",
                context.Request?.Method,
                context.Request?.Path.Value,
                correlationId);

            await _next(context);
        }
    }
}
