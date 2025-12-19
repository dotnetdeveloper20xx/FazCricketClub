using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.Infrastructure.Repositories
{
    /// <summary>
    /// EF Core implementation of <see cref="ISeasonRepository"/>.
    /// </summary>
    public class SeasonRepository : ISeasonRepository
    {
        private readonly CricketClubDbContext _dbContext;

        public SeasonRepository(CricketClubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Season>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Seasons
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Season?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Seasons
                .FirstOrDefaultAsync(s => s.Id == id, cancellationToken);
        }

        public async Task AddAsync(Season season, CancellationToken cancellationToken = default)
        {
            await _dbContext.Seasons.AddAsync(season, cancellationToken);
        }

        /// <summary>
        /// Updates the specified season in the data store.
        /// </summary>
        /// <param name="season">The season to update.</param>
        public void Update(Season season)
        {
            _dbContext.Seasons.Update(season);
        }

        /// <summary>
        /// Soft deletes the season by setting IsDeleted to true.
        /// </summary>
        public void Remove(Season season)
        {
            season.IsDeleted = true;
            // No DbSet.Remove call – we rely on SaveChanges to persist the flag.
        }
    }
}
