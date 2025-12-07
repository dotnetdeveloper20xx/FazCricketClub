using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.Infrastructure.Persistence
{
    /// <summary>
    /// EF Core database context for the CricketClub application.
    /// This is responsible for mapping domain entities to database tables.
    /// </summary>
    public class CricketClubDbContext : DbContext
    {
        /// <summary>
        /// Creates a new instance of the <see cref="CricketClubDbContext"/> class.
        /// </summary>
        /// <param name="options">The options used by the DbContext.</param>
        public CricketClubDbContext(DbContextOptions<CricketClubDbContext> options)
            : base(options)
        {
        }

        /// <summary>
        /// Members in the cricket club.
        /// </summary>
        public DbSet<Member> Members => Set<Member>();

        /// <summary>
        /// Teams that belong to the club.
        /// </summary>
        public DbSet<Team> Teams => Set<Team>();

        /// <summary>
        /// Seasons during which matches are played.
        /// </summary>
        public DbSet<Season> Seasons => Set<Season>();

        /// <summary>
        /// Fixtures (scheduled matches) between teams.
        /// </summary>
        public DbSet<Fixture> Fixtures => Set<Fixture>();

        /// <summary>
        /// Configures the EF Core model.
        /// Applies all IEntityTypeConfiguration implementations from this assembly.
        /// </summary>
        /// <param name="modelBuilder">The model builder used to configure the model.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Apply entity configurations.
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(CricketClubDbContext).Assembly);

            // Global query filters for soft delete.
            modelBuilder.Entity<Member>().HasQueryFilter(m => !m.IsDeleted);
            modelBuilder.Entity<Team>().HasQueryFilter(t => !t.IsDeleted);
            modelBuilder.Entity<Season>().HasQueryFilter(s => !s.IsDeleted);
            modelBuilder.Entity<Fixture>().HasQueryFilter(f => !f.IsDeleted);
        }
    }
}
