using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Repositories
{
    public class BattingScoreRepository : IBattingScoreRepository
    {
        private readonly CricketClubDbContext _context;

        public BattingScoreRepository(CricketClubDbContext context)
        {
            _context = context;
        }

        public async Task<List<BattingScore>> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default)
        {
            return await _context.BattingScores
                .Where(x => x.FixtureId == fixtureId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddRangeAsync(
            IEnumerable<BattingScore> entities,
            CancellationToken cancellationToken = default)
        {
            await _context.BattingScores.AddRangeAsync(entities, cancellationToken);
        }

        public void RemoveRange(IEnumerable<BattingScore> entities)
        {
            _context.BattingScores.RemoveRange(entities);
        }

        public async Task<List<BattingScore>> GetForStatsAsync(
    int? seasonId,
    CancellationToken cancellationToken = default)
        {
            // If no season filter, return all batting scores.
            if (!seasonId.HasValue)
            {
                return await _context.BattingScores
                    .AsNoTracking()
                    .ToListAsync(cancellationToken);
            }

            // Filter batting scores by fixtures that belong to the given season.
            var query =
                from bs in _context.BattingScores.AsNoTracking()
                join f in _context.Fixtures.AsNoTracking()
                    on bs.FixtureId equals f.Id
                where f.SeasonId == seasonId.Value
                select bs;

            return await query.ToListAsync(cancellationToken);
        }

    }
}
