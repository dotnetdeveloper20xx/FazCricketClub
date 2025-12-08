using AutoMapper;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="ISeasonService"/>.
    /// Coordinates repositories, unit of work, and mappings.
    /// </summary>
    public class SeasonService : ISeasonService
    {
        private readonly ISeasonRepository _seasonRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public SeasonService(
            ISeasonRepository seasonRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _seasonRepository = seasonRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<SeasonDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var seasons = await _seasonRepository.GetAllAsync(cancellationToken);

            // Keep ordering explicit, then map.
            var ordered = seasons.OrderBy(s => s.StartDate).ToList();

            return _mapper.Map<List<SeasonDto>>(ordered);
        }

        public async Task<SeasonDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var season = await _seasonRepository.GetByIdAsync(id, cancellationToken);

            if (season == null)
            {
                return null;
            }

            return _mapper.Map<SeasonDto>(season);
        }

        public async Task<SeasonDto> CreateAsync(CreateSeasonDto request, CancellationToken cancellationToken = default)
        {
            // Map DTO -> entity
            var season = _mapper.Map<Season>(request);

            await _seasonRepository.AddAsync(season, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Map entity -> DTO (with generated Id)
            var result = _mapper.Map<SeasonDto>(season);
            return result;
        }

        public async Task<bool> UpdateAsync(int id, UpdateSeasonDto request, CancellationToken cancellationToken = default)
        {
            var season = await _seasonRepository.GetByIdAsync(id, cancellationToken);

            if (season == null)
            {
                return false;
            }

            // Map updated fields onto existing entity.
            _mapper.Map(request, season);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var season = await _seasonRepository.GetByIdAsync(id, cancellationToken);

            if (season == null)
            {
                return false;
            }

            _seasonRepository.Remove(season);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}

