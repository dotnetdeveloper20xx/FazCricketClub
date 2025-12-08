using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Configurations
{
    public class MatchResultConfiguration : IEntityTypeConfiguration<MatchResult>
    {
        public void Configure(EntityTypeBuilder<MatchResult> builder)
        {
            builder.ToTable("MatchResults");

            builder.HasKey(x => x.Id);

            builder.HasOne(x => x.Fixture)
                .WithOne(f => f.MatchResult)
                .HasForeignKey<MatchResult>(x => x.FixtureId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(x => x.ResultSummary)
                .HasMaxLength(200);

            builder.Property(x => x.Notes)
                .HasMaxLength(1000);
        }
    }
}
