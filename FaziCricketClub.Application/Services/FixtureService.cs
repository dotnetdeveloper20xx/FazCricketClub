using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="IFixtureService"/>.
    /// </summary>
    public class FixtureService : IFixtureService
    {
        private readonly IFixtureRepository _fixtureRepository;
        private readonly IUnitOfWork _unitOfWork;

        public FixtureService(IFixtureRepository fixtureRepository, IUnitOfWork unitOfWork)
        {
            _fixtureRepository = fixtureRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<List<FixtureDto>> GetAllAsync(CancellationToken cancellationToken = default)
        {
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            return fixtures
                .OrderBy(f => f.StartDateTime)
                .Select(f => new FixtureDto
                {
                    Id = f.Id,
                    SeasonId = f.SeasonId,
                    HomeTeamId = f.HomeTeamId,
                    AwayTeamId = f.AwayTeamId,
                    StartDateTime = f.StartDateTime,
                    Venue = f.Venue,
                    CompetitionName = f.CompetitionName,
                    Status = f.Status
                })
                .ToList();
        }

        public async Task<FixtureDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
        {
            var fixture = await _fixtureRepository.GetByIdAsync(id, cancellationToken);

            if (fixture == null)
            {
                return null;
            }

            return new FixtureDto
            {
                Id = fixture.Id,
                SeasonId = fixture.SeasonId,
                HomeTeamId = fixture.HomeTeamId,
                AwayTeamId = fixture.AwayTeamId,
                StartDateTime = fixture.StartDateTime,
                Venue = fixture.Venue,
                CompetitionName = fixture.CompetitionName,
                Status = fixture.Status
            };
        }

        public async Task<FixtureDto> CreateAsync(CreateFixtureDto request, CancellationToken cancellationToken = default)
        {
            var fixture = new Fixture
            {
                SeasonId = request.SeasonId,
                HomeTeamId = request.HomeTeamId,
                AwayTeamId = request.AwayTeamId,
                StartDateTime = request.StartDateTime,
                Venue = request.Venue,
                CompetitionName = request.CompetitionName,
                Status = request.Status
            };

            await _fixtureRepository.AddAsync(fixture, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            return new FixtureDto
            {
                Id = fixture.Id,
                SeasonId = fixture.SeasonId,
                HomeTeamId = fixture.HomeTeamId,
                AwayTeamId = fixture.AwayTeamId,
                StartDateTime = fixture.StartDateTime,
                Venue = fixture.Venue,
                CompetitionName = fixture.CompetitionName,
                Status = fixture.Status
            };
        }

        public async Task<bool> UpdateAsync(int id, UpdateFixtureDto request, CancellationToken cancellationToken = default)
        {
            var fixture = await _fixtureRepository.GetByIdAsync(id, cancellationToken);

            if (fixture == null)
            {
                return false;
            }

            fixture.SeasonId = request.SeasonId;
            fixture.HomeTeamId = request.HomeTeamId;
            fixture.AwayTeamId = request.AwayTeamId;
            fixture.StartDateTime = request.StartDateTime;
            fixture.Venue = request.Venue;
            fixture.CompetitionName = request.CompetitionName;
            fixture.Status = request.Status;

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
