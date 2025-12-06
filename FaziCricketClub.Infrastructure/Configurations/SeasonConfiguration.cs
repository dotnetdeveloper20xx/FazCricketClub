using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FaziCricketClub.Infrastructure.Configurations
{
    /// <summary>
    /// EF Core configuration for the <see cref="Season"/> entity.
    /// </summary>
    public class SeasonConfiguration : IEntityTypeConfiguration<Season>
    {
        public void Configure(EntityTypeBuilder<Season> builder)
        {
            builder.HasKey(s => s.Id);

            builder.Property(s => s.Name)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(s => s.Description)
                   .HasMaxLength(500);

            builder.Property(s => s.StartDate)
                   .IsRequired();

            builder.Property(s => s.EndDate)
                   .IsRequired();
        }
    }
}
