using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.Infrastructure.Repositories
{
    /// <summary>
    /// EF Core implementation of <see cref="IFixtureRepository"/>.
    /// Respects global query filters for soft delete.
    /// </summary>
    public class FixtureRepository : IFixtureRepository
    {
        private readonly CricketClubDbContext _dbContext;

        public FixtureRepository(CricketClubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Fixture>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            // Global query filter excludes IsDeleted == true.
            return await _dbContext.Fixtures
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Fixture?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Fixtures
                .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
        }

        public async Task AddAsync(Fixture fixture, CancellationToken cancellationToken = default)
        {
            await _dbContext.Fixtures.AddAsync(fixture, cancellationToken);
        }

        public void Update(Fixture fixture)
        {
            _dbContext.Fixtures.Update(fixture);
        }

        /// <summary>
        /// Soft deletes the fixture by marking IsDeleted = true.
        /// </summary>
        public void Remove(Fixture fixture)
        {
            fixture.IsDeleted = true;
        }
    }
}
