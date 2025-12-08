using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Infrastructure.Repositories
{
    public class MatchResultRepository : IMatchResultRepository
    {
        private readonly CricketClubDbContext _context;

        public MatchResultRepository(CricketClubDbContext context)
        {
            _context = context;
        }

        public async Task<MatchResult?> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default)
        {
            return await _context.MatchResults
                .AsNoTracking()
                .SingleOrDefaultAsync(
                    x => x.FixtureId == fixtureId,
                    cancellationToken);
        }

        public async Task AddAsync(
            MatchResult entity,
            CancellationToken cancellationToken = default)
        {
            await _context.MatchResults.AddAsync(entity, cancellationToken);
        }

        public void Update(MatchResult entity)
        {
            _context.MatchResults.Update(entity);
        }

        public void Remove(MatchResult entity)
        {
            _context.MatchResults.Remove(entity);
        }
    }
}
