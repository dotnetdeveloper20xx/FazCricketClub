using AutoMapper;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="ITeamService"/>.
    /// Coordinates repositories, unit of work, and mappings.
    /// </summary>
    public class TeamService : ITeamService
    {
        private readonly ITeamRepository _teamRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public TeamService(
            ITeamRepository teamRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _teamRepository = teamRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<TeamDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var teams = await _teamRepository.GetAllAsync(cancellationToken);

            // Explicit ordering, then map.
            var ordered = teams.OrderBy(t => t.Name).ToList();

            return _mapper.Map<List<TeamDto>>(ordered);
        }

        public async Task<TeamDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var team = await _teamRepository.GetByIdAsync(id, cancellationToken);

            if (team == null)
            {
                return null;
            }

            return _mapper.Map<TeamDto>(team);
        }

        public async Task<TeamDto> CreateAsync(CreateTeamDto request, CancellationToken cancellationToken = default)
        {
            var team = _mapper.Map<Team>(request);

            await _teamRepository.AddAsync(team, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<TeamDto>(team);
        }

        public async Task<bool> UpdateAsync(int id, UpdateTeamDto request, CancellationToken cancellationToken = default)
        {
            var team = await _teamRepository.GetByIdAsync(id, cancellationToken);

            if (team == null)
            {
                return false;
            }

            // Map request → existing entity
            _mapper.Map(request, team);

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
