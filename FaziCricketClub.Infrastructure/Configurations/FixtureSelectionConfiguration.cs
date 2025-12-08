using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Configurations
{
    public class FixtureSelectionConfiguration : IEntityTypeConfiguration<FixtureSelection>
    {
        public void Configure(EntityTypeBuilder<FixtureSelection> builder)
        {
            builder.ToTable("FixtureSelections");

            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Fixture)
                .WithOne(f => f.Selection)
                .HasForeignKey<FixtureSelection>(x => x.FixtureId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(x => x.Notes)
                .HasMaxLength(1000);

            builder.Property(x => x.CreatedAt)
                .IsRequired();
        }
    }
}
