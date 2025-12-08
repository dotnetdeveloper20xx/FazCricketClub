using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Configurations
{
    public class FixtureSelectionPlayerConfiguration : IEntityTypeConfiguration<FixtureSelectionPlayer>
    {
        public void Configure(EntityTypeBuilder<FixtureSelectionPlayer> builder)
        {
            builder.ToTable("FixtureSelectionPlayers");

            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.FixtureSelection)
                .WithMany(s => s.Players)
                .HasForeignKey(x => x.FixtureSelectionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Member)
                .WithMany(m => m.FixtureSelections)
                .HasForeignKey(x => x.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Role)
                .HasMaxLength(50);

            builder.Property(x => x.Notes)
                .HasMaxLength(500);
        }
    }
}
