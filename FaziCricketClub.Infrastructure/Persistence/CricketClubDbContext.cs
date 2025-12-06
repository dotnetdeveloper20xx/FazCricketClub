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
        /// We keep this simple for now and will move to explicit configuration classes later if needed.
        /// </summary>
        /// <param name="modelBuilder">The model builder used to configure the model.</param>
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Basic configuration. We rely on conventions for now,
            // and can refine this in a later step with Fluent API if required.

            modelBuilder.Entity<Member>(entity =>
            {
                entity.Property(m => m.FullName)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(m => m.Email)
                      .IsRequired()
                      .HasMaxLength(200);
            });

            modelBuilder.Entity<Team>(entity =>
            {
                entity.Property(t => t.Name)
                      .IsRequired()
                      .HasMaxLength(100);
            });

            modelBuilder.Entity<Season>(entity =>
            {
                entity.Property(s => s.Name)
                      .IsRequired()
                      .HasMaxLength(100);
            });

            modelBuilder.Entity<Fixture>(entity =>
            {
                entity.Property(f => f.Venue)
                      .IsRequired()
                      .HasMaxLength(200);

                entity.Property(f => f.CompetitionName)
                      .IsRequired()
                      .HasMaxLength(100);

                entity.Property(f => f.Status)
                      .IsRequired()
                      .HasMaxLength(50);

                // Relationships (using conventions, but we can be explicit if we want)
                entity.HasOne(f => f.Season)
                      .WithMany(s => s.Fixtures)
                      .HasForeignKey(f => f.SeasonId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(f => f.HomeTeam)
                      .WithMany(t => t.HomeFixtures)
                      .HasForeignKey(f => f.HomeTeamId)
                      .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(f => f.AwayTeam)
                      .WithMany(t => t.AwayFixtures)
                      .HasForeignKey(f => f.AwayTeamId)
                      .OnDelete(DeleteBehavior.Restrict);
            });

            // Note: Member <-> Team many-to-many can be configured later if desired,
            // using a join entity or EF Core's many-to-many support.
        }
    }
}
