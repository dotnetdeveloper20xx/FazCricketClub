using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Configurations
{
    public class BattingScoreConfiguration : IEntityTypeConfiguration<BattingScore>
    {
        public void Configure(EntityTypeBuilder<BattingScore> builder)
        {
            builder.ToTable("BattingScores");

            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Fixture)
                .WithMany(f => f.BattingScores)
                .HasForeignKey(x => x.FixtureId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Member)
                .WithMany(m => m.BattingScores)
                .HasForeignKey(x => x.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.BattingOrder)
                .IsRequired();

            builder.Property(x => x.Runs)
                .IsRequired();

            builder.Property(x => x.Balls)
                .IsRequired();

            builder.Property(x => x.DismissalType)
                .HasMaxLength(50);

            builder.Property(x => x.Notes)
                .HasMaxLength(500);
        }
    }
}
