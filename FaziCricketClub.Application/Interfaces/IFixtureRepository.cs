using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Abstraction over data access for fixtures.
    /// </summary>
    public interface IFixtureRepository
    {
        Task<List<Fixture>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<Fixture?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task AddAsync(Fixture fixture, CancellationToken cancellationToken = default);

        void Remove(Fixture fixture);
    }
}
