using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FaziCricketClub.Infrastructure.Configurations
{
    /// <summary>
    /// EF Core configuration for the <see cref="Member"/> entity.
    /// Keeps all Member-specific mapping concerns in one place.
    /// </summary>
    public class MemberConfiguration : IEntityTypeConfiguration<Member>
    {
        public void Configure(EntityTypeBuilder<Member> builder)
        {
            builder.HasKey(m => m.Id);

            builder.Property(m => m.FullName)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(m => m.Email)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(m => m.PhoneNumber)
                   .HasMaxLength(50);

            builder.Property(m => m.IsActive)
                   .HasDefaultValue(true);

            // Many-to-many with Team will be configured via TeamConfiguration or a join entity later.
        }
    }
}
