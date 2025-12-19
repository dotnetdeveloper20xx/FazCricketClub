using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Abstraction over data access for seasons.
    /// </summary>
    public interface ISeasonRepository
    {
        Task<List<Season>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<Season?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task AddAsync(Season season, CancellationToken cancellationToken = default);

        /// <summary>
        /// Updates the specified season in the data store.
        /// </summary>
        /// <param name="season">The season to update.</param>
        void Update(Season season);

        /// <summary>
        /// Removes the specified season from the data store.
        /// </summary>
        /// <param name="season">The season to remove.</param>
        void Remove(Season season);
    }
}
