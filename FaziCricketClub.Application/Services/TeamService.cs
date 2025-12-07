using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="ITeamService"/>.
    /// </summary>
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUnitOfWork _unitOfWork;

        public TeamService(ITeamRepository teamRepository, IUnitOfWork unitOfWork)
        {
            _teamRepository = teamRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<TeamDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var teams = await _teamRepository.GetAllAsync(cancellationToken);

            return teams
                .OrderBy(t => t.Name)
                .Select(t => new TeamDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Description = t.Description,
                    IsActive = t.IsActive
                })
                .ToList();
        }

        public async Task<TeamDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var team = await _teamRepository.GetByIdAsync(id, cancellationToken);

            if (team == null)
            {
                return null;
            }

            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Description = team.Description,
                IsActive = team.IsActive
            };
        }

        public async Task<TeamDto> CreateAsync(CreateTeamDto request, CancellationToken cancellationToken = default)
        {
            var team = new Team
            {
                Name = request.Name,
                Description = request.Description,
                IsActive = request.IsActive
            };

            await _teamRepository.AddAsync(team, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new TeamDto
            {
                Id = team.Id,
                Name = team.Name,
                Description = team.Description,
                IsActive = team.IsActive
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateTeamDto request, CancellationToken cancellationToken = default)
        {
            var team = await _teamRepository.GetByIdAsync(id, cancellationToken);

            if (team == null)
            {
                return false;
            }

            team.Name = request.Name;
            team.Description = request.Description;
            team.IsActive = request.IsActive;

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var team = await _teamRepository.GetByIdAsync(id, cancellationToken);

            if (team == null)
            {
                return false;
            }

            _teamRepository.Remove(team);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
