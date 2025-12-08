using AutoMapper;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="IFixtureService"/>.
    /// Coordinates repositories, unit of work, and mappings.
    /// </summary>
    public class FixtureService : IFixtureService
    {
        private readonly IFixtureRepository _fixtureRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public FixtureService(
            IFixtureRepository fixtureRepository,
            IUnitOfWork unitOfWork,
            IMapper mapper)
        {
            _fixtureRepository = fixtureRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        public async Task<List<FixtureDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            // Ensure stable ordering by StartDateTime, then map.
            var ordered = fixtures.OrderBy(f => f.StartDateTime).ToList();

            return _mapper.Map<List<FixtureDto>>(ordered);
        }

        public async Task<FixtureDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var fixture = await _fixtureRepository.GetByIdAsync(id, cancellationToken);

            if (fixture == null)
            {
                return null;
            }

            return _mapper.Map<FixtureDto>(fixture);
        }

        public async Task<FixtureDto> CreateAsync(CreateFixtureDto request, CancellationToken cancellationToken = default)
        {
            var fixture = _mapper.Map<Fixture>(request);

            await _fixtureRepository.AddAsync(fixture, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return _mapper.Map<FixtureDto>(fixture);
        }

        public async Task<bool> UpdateAsync(int id, UpdateFixtureDto request, CancellationToken cancellationToken = default)
        {
            var fixture = await _fixtureRepository.GetByIdAsync(id, cancellationToken);

            if (fixture == null)
            {
                return false;
            }

            // Map updated fields onto the existing entity.
            _mapper.Map(request, fixture);

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
        {
            var fixture = await _fixtureRepository.GetByIdAsync(id, cancellationToken);

            if (fixture == null)
            {
                return false;
            }

            _fixtureRepository.Remove(fixture);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
