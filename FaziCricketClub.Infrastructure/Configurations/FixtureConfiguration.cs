using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FaziCricketClub.Infrastructure.Configurations
{
    /// <summary>
    /// EF Core configuration for the <see cref="Fixture"/> entity.
    /// </summary>
    public class FixtureConfiguration : IEntityTypeConfiguration<Fixture>
    {
        public void Configure(EntityTypeBuilder<Fixture> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Venue)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(f => f.CompetitionName)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(f => f.Status)
                   .IsRequired()
                   .HasMaxLength(50);

            builder.Property(f => f.StartDateTime)
                   .IsRequired();

            builder.Property(f => f.IsDeleted)
                   .HasDefaultValue(false);

            builder.HasOne(f => f.Season)
                   .WithMany(s => s.Fixtures)
                   .HasForeignKey(f => f.SeasonId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(f => f.HomeTeam)
                   .WithMany(t => t.HomeFixtures)
                   .HasForeignKey(f => f.HomeTeamId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(f => f.AwayTeam)
                   .WithMany(t => t.AwayFixtures)
                   .HasForeignKey(f => f.AwayTeamId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
