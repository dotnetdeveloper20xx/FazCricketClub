using FaziCricketClub.Application.Dtos;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Application-level service for working with teams.
    /// </summary>
    public interface ITeamService
    {
        Task<List<TeamDto>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<TeamDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<TeamDto> CreateAsync(CreateTeamDto request, CancellationToken cancellationToken = default);

        Task<bool> UpdateAsync(int id, UpdateTeamDto request, CancellationToken cancellationToken = default);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
