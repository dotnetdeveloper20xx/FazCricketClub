using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Configurations
{
    public class BowlingFigureConfiguration : IEntityTypeConfiguration<BowlingFigure>
    {
        public void Configure(EntityTypeBuilder<BowlingFigure> builder)
        {
            builder.ToTable("BowlingFigures");

            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Fixture)
                .WithMany(f => f.BowlingFigures)
                .HasForeignKey(x => x.FixtureId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Member)
                .WithMany(m => m.BowlingFigures)
                .HasForeignKey(x => x.MemberId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Property(x => x.Overs)
                .HasColumnType("decimal(4,1)");

            builder.Property(x => x.Notes)
                .HasMaxLength(500);
        }
    }
}
