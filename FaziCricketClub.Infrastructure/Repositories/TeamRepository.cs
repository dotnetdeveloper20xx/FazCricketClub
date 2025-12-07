using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.Infrastructure.Repositories
{
    /// <summary>
    /// EF Core implementation of <see cref="ITeamRepository"/>.
    /// </summary>
    public class TeamRepository : ITeamRepository
    {
        private readonly CricketClubDbContext _dbContext;

        public TeamRepository(CricketClubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Team>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            return await _dbContext.Teams
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Team?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Teams
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
        }

        public async Task AddAsync(Team team, CancellationToken cancellationToken = default)
        {
            await _dbContext.Teams.AddAsync(team, cancellationToken);
        }

        /// <summary>
        /// Soft deletes the team by setting IsDeleted to true.
        /// </summary>
        public void Remove(Team team)
        {
            team.IsDeleted = true;
        }
    }
}
