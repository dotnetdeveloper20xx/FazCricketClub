namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Represents a unit of work over the underlying data store.
    /// This allows multiple repository operations to be committed as a single transaction.
    /// </summary>
    public interface IUnitOfWork
    {
        /// <summary>
        /// Persists all changes made in the current unit of work.
        /// </summary>
        /// <param name="cancellationToken">A cancellation token.</param>
        /// <returns>The number of state entries written to the data store.</returns>
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
