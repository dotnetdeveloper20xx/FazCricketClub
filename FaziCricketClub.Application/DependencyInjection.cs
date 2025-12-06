using Microsoft.Extensions.DependencyInjection;

namespace FaziCricketClub.Application
{
    /// <summary>
    /// Provides extension methods to register application-layer services,
    /// such as use case handlers, validators, and other application logic.
    /// </summary>
    public static class DependencyInjection
    {
        /// <summary>
        /// Adds application-layer services to the DI container.
        /// </summary>
        /// <param name="services">The service collection to add services to.</param>
        /// <returns>The same service collection, for chaining.</returns>
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // TODO: Register MediatR handlers, validators, application services, etc.
            // e.g. services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));

            return services;
        }
    }
}
