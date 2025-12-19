using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.Infrastructure.Repositories
{
    /// <summary>
    /// EF Core implementation of <see cref="IMemberRepository"/>.
    /// Respects global query filters for soft delete.
    /// </summary>
    public class MemberRepository : IMemberRepository
    {
        private readonly CricketClubDbContext _dbContext;

        public MemberRepository(CricketClubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Member>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            // Global query filter excludes IsDeleted == true.
            return await _dbContext.Members
                .AsNoTracking()
                .ToListAsync(cancellationToken);
        }

        public async Task<Member?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            return await _dbContext.Members
                .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
        }

        public async Task AddAsync(Member member, CancellationToken cancellationToken = default)
        {
            await _dbContext.Members.AddAsync(member, cancellationToken);
        }

        public void Update(Member member)
        {
            _dbContext.Members.Update(member);
        }

        /// <summary>
        /// Soft deletes the member by marking IsDeleted = true.
        /// </summary>
        public void Remove(Member member)
        {
            member.IsDeleted = true;
        }
    }
}
