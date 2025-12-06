using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="ISeasonService"/>.
    /// Uses repositories and unit of work to perform operations.
    /// </summary>
    public class SeasonService : ISeasonService
    {
        private readonly ISeasonRepository _seasonRepository;
        private readonly IUnitOfWork _unitOfWork;

        public SeasonService(ISeasonRepository seasonRepository, IUnitOfWork unitOfWork)
        {
            _seasonRepository = seasonRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<SeasonDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var seasons = await _seasonRepository.GetAllAsync(cancellationToken);

            return seasons
                .OrderBy(s => s.StartDate)
                .Select(s => new SeasonDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate
                })
                .ToList();
        }

        public async Task<SeasonDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var season = await _seasonRepository.GetByIdAsync(id, cancellationToken);

            if (season == null)
            {
                return null;
            }

            return new SeasonDto
            {
                Id = season.Id,
                Name = season.Name,
                Description = season.Description,
                StartDate = season.StartDate,
                EndDate = season.EndDate
            };
        }

        public async Task<SeasonDto> CreateAsync(CreateSeasonDto request, CancellationToken cancellationToken = default)
        {
            var season = new Season
            {
                Name = request.Name,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            await _seasonRepository.AddAsync(season, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new SeasonDto
            {
                Id = season.Id,
                Name = season.Name,
                Description = season.Description,
                StartDate = season.StartDate,
                EndDate = season.EndDate
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateSeasonDto request, CancellationToken cancellationToken = default)
        {
            var season = await _seasonRepository.GetByIdAsync(id, cancellationToken);

            if (season == null)
            {
                return false;
            }

            season.Name = request.Name;
            season.Description = request.Description;
            season.StartDate = request.StartDate;
            season.EndDate = request.EndDate;

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
