using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Infrastructure.Persistence;
using FaziCricketClub.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FaziCricketClub.Infrastructure
{
    /// <summary>
    /// Provides extension methods to register infrastructure services
    /// such as the EF Core DbContext, repositories, and external integrations.
    /// </summary>
    public static class DependencyInjection
    {
        /// <summary>
        /// Adds infrastructure services to the DI container.
        /// </summary>
        /// <param name="services">The service collection to add services to.</param>
        /// <param name="configuration">The application configuration.</param>
        /// <returns>The same service collection, for chaining.</returns>
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("CricketClubDatabase");

            // Configure EF Core DbContext.
            services.AddDbContext<CricketClubDbContext>(options =>
            {
                options.UseSqlServer(connectionString);
            });

            // Unit of Work
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Repositories
            services.AddScoped<ISeasonRepository, SeasonRepository>();

            // TODO: Register other repositories here as we add them.

            return services;
        }
    }
}
