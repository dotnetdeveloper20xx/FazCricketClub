using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Configurations
{
    public class FixtureAvailabilityConfiguration : IEntityTypeConfiguration<FixtureAvailability>
    {
        public void Configure(EntityTypeBuilder<FixtureAvailability> builder)
        {
            builder.ToTable("FixtureAvailabilities");

            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Fixture)
                .WithMany(f => f.Availabilities)
                .HasForeignKey(x => x.FixtureId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Member)
                .WithMany(m => m.FixtureAvailabilities)
                .HasForeignKey(x => x.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Status)
                .IsRequired()
                .HasMaxLength(20);

            builder.Property(x => x.Notes)
                .HasMaxLength(500);

            builder.Property(x => x.UpdatedAt)
                .IsRequired();
        }
    }
}
