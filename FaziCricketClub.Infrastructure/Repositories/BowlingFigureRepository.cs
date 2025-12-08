using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Repositories
{
    public class BowlingFigureRepository : IBowlingFigureRepository
    {
        private readonly CricketClubDbContext _context;

        public BowlingFigureRepository(CricketClubDbContext context)
        {
            _context = context;
        }

        public async Task<List<BowlingFigure>> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default)
        {
            return await _context.BowlingFigures
                .Where(x => x.FixtureId == fixtureId)
                .ToListAsync(cancellationToken);
        }

        public async Task AddRangeAsync(
            IEnumerable<BowlingFigure> entities,
            CancellationToken cancellationToken = default)
        {
            await _context.BowlingFigures.AddRangeAsync(entities, cancellationToken);
        }

        public void RemoveRange(IEnumerable<BowlingFigure> entities)
        {
            _context.BowlingFigures.RemoveRange(entities);
        }

        public async Task<List<BowlingFigure>> GetForStatsAsync(
    int? seasonId,
    CancellationToken cancellationToken = default)
        {
            if (!seasonId.HasValue)
            {
                return await _context.BowlingFigures
                    .AsNoTracking()
                    .ToListAsync(cancellationToken);
            }

            var query =
                from bf in _context.BowlingFigures.AsNoTracking()
                join f in _context.Fixtures.AsNoTracking()
                    on bf.FixtureId equals f.Id
                where f.SeasonId == seasonId.Value
                select bf;

            return await query.ToListAsync(cancellationToken);
        }

    }
}
