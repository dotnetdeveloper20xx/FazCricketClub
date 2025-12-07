using FaziCricketClub.Application.Dtos;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Application-level service for working with fixtures.
    /// </summary>
    public interface IFixtureService
    {
        Task<List<FixtureDto>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<FixtureDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<FixtureDto> CreateAsync(CreateFixtureDto request, CancellationToken cancellationToken = default);

        Task<bool> UpdateAsync(int id, UpdateFixtureDto request, CancellationToken cancellationToken = default);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
