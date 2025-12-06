using FaziCricketClub.Application.Dtos;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Application-level service for working with seasons.
    /// Encapsulates business logic and coordinates repositories/unit of work.
    /// </summary>
    public interface ISeasonService
    {
        Task<List<SeasonDto>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<SeasonDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<SeasonDto> CreateAsync(CreateSeasonDto request, CancellationToken cancellationToken = default);

        Task<bool> UpdateAsync(int id, UpdateSeasonDto request, CancellationToken cancellationToken = default);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
