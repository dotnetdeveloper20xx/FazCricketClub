namespace FaziCricketClub.API.Middleware
{
    public static class MiddlewareExtensions
    {
        /// <summary>
        /// Adds the correlation ID middleware to the pipeline.
        /// </summary>
        public static IApplicationBuilder UseCorrelationId(this IApplicationBuilder app)
        {
            return app.UseMiddleware<CorrelationIdMiddleware>();
        }

        /// <summary>
        /// Adds the global exception handling middleware to the pipeline.
        /// </summary>
        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<GlobalExceptionHandlingMiddleware>();
        }
    }
}
