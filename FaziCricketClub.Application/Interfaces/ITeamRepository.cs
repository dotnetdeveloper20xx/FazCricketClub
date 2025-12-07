using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Abstraction over data access for teams.
    /// </summary>
    public interface ITeamRepository
    {
        Task<List<Team>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<Team?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task AddAsync(Team team, CancellationToken cancellationToken = default);

        void Remove(Team team);
    }
}
