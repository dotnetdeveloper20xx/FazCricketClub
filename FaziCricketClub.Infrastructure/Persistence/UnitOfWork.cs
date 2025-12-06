using FaziCricketClub.Application.Interfaces;

namespace FaziCricketClub.Infrastructure.Persistence
{
    /// <summary>
    /// Default implementation of <see cref="IUnitOfWork"/> backed by EF Core DbContext.
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly CricketClubDbContext _dbContext;

        public UnitOfWork(CricketClubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            return _dbContext.SaveChangesAsync(cancellationToken);
        }
    }
}
