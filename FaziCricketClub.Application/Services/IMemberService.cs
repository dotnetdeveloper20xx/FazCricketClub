using FaziCricketClub.Application.Dtos;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Application-level service for working with members.
    /// </summary>
    public interface IMemberService
    {
        Task<List<MemberDto>> GetAllAsync(CancellationToken cancellationToken = default);

        Task<MemberDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

        Task<MemberDto> CreateAsync(CreateMemberDto request, CancellationToken cancellationToken = default);

        Task<bool> UpdateAsync(int id, UpdateMemberDto request, CancellationToken cancellationToken = default);

        Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
    }
}
