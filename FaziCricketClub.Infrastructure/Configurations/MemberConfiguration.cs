using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FaziCricketClub.Infrastructure.Configurations
{
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

            builder.Property(m => m.IsDeleted)
                   .HasDefaultValue(false);
        }
    }
}
