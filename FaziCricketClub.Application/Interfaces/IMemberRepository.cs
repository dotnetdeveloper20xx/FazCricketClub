using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Abstraction over data access for members.
    /// </summary>
    public interface IMemberRepository
    {
        Task<List<Member>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<Member?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task AddAsync(Member member, CancellationToken cancellationToken = default);

        void Remove(Member member);
    }
}
