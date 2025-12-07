using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FaziCricketClub.Infrastructure.Configurations
{
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

            builder.Property(t => t.IsDeleted)
                   .HasDefaultValue(false);
        }
    }
}
