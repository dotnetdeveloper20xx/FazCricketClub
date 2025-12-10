using FaziCricketClub.IdentityApi.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.IdentityApi.Data
{
    /// <summary>
    /// EF Core DbContext dedicated to ASP.NET Core Identity.
    /// 
    /// Inherits from IdentityDbContext{TUser, TRole, TKey} to:
    /// - Automatically include all Identity-related tables (Users, Roles, Claims, etc.).
    /// - Use our ApplicationUser/ApplicationRole classes with Guid keys.
    /// 
    /// This context is intentionally focused on Identity concerns only.
    /// Domain data for cricket (matches, teams, etc.) stays in its own DbContext
    /// in the main CricketClub application, respecting separation of concerns.
    /// </summary>
    public class CricketClubIdentityDbContext
        : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        /// <summary>
        /// Standard DbContext constructor used by ASP.NET Core DI.
        /// </summary>
        /// <param name="options">Options for configuring the DbContext.</param>
        public CricketClubIdentityDbContext(
            DbContextOptions<CricketClubIdentityDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Allows additional model configuration.
        /// We call base.OnModelCreating(builder) to ensure Identity's default mappings are applied.
        /// </summary>
        /// <param name="builder">Model builder used to configure the schema.</param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Important: call the base method so that Identity can configure its tables.
            base.OnModelCreating(builder);

            // Here you can customize the Identity schema if needed, for example:
            //
            // - Rename tables (e.g., builder.Entity<ApplicationUser>().ToTable("Users"))
            // - Add indexes or constraints
            // - Configure custom properties on ApplicationUser/ApplicationRole
            //
            // For now we keep the default Identity table names.
        }
    }
}
