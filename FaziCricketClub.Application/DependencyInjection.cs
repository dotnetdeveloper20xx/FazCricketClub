using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Application.Services;
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
            // Application services
            services.AddScoped<ISeasonService, SeasonService>();
            services.AddScoped<ITeamService, TeamService>();
            services.AddScoped<IMemberService, MemberService>();

            // TODO: Register MediatR, validators, other services here later.

            return services;
        }
    }
}
