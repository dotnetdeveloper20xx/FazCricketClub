using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FaziCricketClub.Infrastructure.Configurations
{
    /// <summary>
    /// EF Core configuration for the <see cref="Team"/> entity.
    /// </summary>
    public class TeamConfiguration : IEntityTypeConfiguration<Team>
    {
        public void Configure(EntityTypeBuilder<Team> builder)
        {
            builder.HasKey(t => t.Id);

            builder.Property(t => t.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(t => t.Description)
                   .HasMaxLength(500);

            builder.Property(t => t.IsActive)
                   .HasDefaultValue(true);

            // Relationships to HomeFixtures/AwayFixtures are configured in FixtureConfiguration.
            // Many-to-many with Member can be added later using EF Core's many-to-many support.
        }
    }
}
