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

        public async Task<List<FixtureDto>> GetUpcomingAsync(
    int daysAhead,
    int? teamId = null,
    CancellationToken cancellationToken = default)
        {
            if (daysAhead <= 0)
            {
                daysAhead = 7; // sensible default
            }

            var now = DateTime.UtcNow;
            var upper = now.AddDays(daysAhead);

            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);
            var query = fixtures.AsQueryable();

            // Only future fixtures in the time window
            query = query.Where(f => f.StartDateTime >= now && f.StartDateTime <= upper);

            // Optional team filter
            if (teamId.HasValue)
            {
                var id = teamId.Value;
                query = query.Where(f => f.HomeTeamId == id || f.AwayTeamId == id);
            }

            // Optional: only "Scheduled"/similar statuses
            query = query.Where(f =>
                string.Equals(f.Status, "Scheduled", StringComparison.OrdinalIgnoreCase) ||
                string.Equals(f.Status, "Planned", StringComparison.OrdinalIgnoreCase) ||
                string.IsNullOrWhiteSpace(f.Status));

            // Order by date
            var ordered = query
                .OrderBy(f => f.StartDateTime)
                .ToList();

            return _mapper.Map<List<FixtureDto>>(ordered);
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

        public async Task<PagedResult<FixtureDto>> GetPagedAsync(
       FixtureFilterParameters filter,
       CancellationToken cancellationToken = default)
        {
            // Load all fixtures from the repository.
            // (Later we could push filtering down to EF; for now it’s in-memory and simple.)
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            var query = fixtures.AsQueryable();

            // 1. Filtering
            if (filter.SeasonId.HasValue)
            {
                query = query.Where(f => f.SeasonId == filter.SeasonId.Value);
            }

            if (filter.TeamId.HasValue)
            {
                var teamId = filter.TeamId.Value;
                query = query.Where(f => f.HomeTeamId == teamId || f.AwayTeamId == teamId);
            }

            if (filter.FromDate.HasValue)
            {
                query = query.Where(f => f.StartDateTime >= filter.FromDate.Value);
            }

            if (filter.ToDate.HasValue)
            {
                query = query.Where(f => f.StartDateTime <= filter.ToDate.Value);
            }

            // 2. Sorting
            var sortBy = (filter.SortBy ?? "date").ToLowerInvariant();
            var sortDirection = (filter.SortDirection ?? "asc").ToLowerInvariant();
            var descending = sortDirection == "desc";

            query = sortBy switch
            {
                "competition" => descending
                    ? query.OrderByDescending(f => f.CompetitionName)
                           .ThenByDescending(f => f.StartDateTime)
                    : query.OrderBy(f => f.CompetitionName)
                           .ThenBy(f => f.StartDateTime),

                "status" => descending
                    ? query.OrderByDescending(f => f.Status)
                           .ThenByDescending(f => f.StartDateTime)
                    : query.OrderBy(f => f.Status)
                           .ThenBy(f => f.StartDateTime),

                _ => descending
                    ? query.OrderByDescending(f => f.StartDateTime)
                    : query.OrderBy(f => f.StartDateTime),
            };

            // 3. Paging (with sane defaults)
            var page = filter.Page <= 0 ? 1 : filter.Page;
            var pageSize = filter.PageSize <= 0 ? 20 : filter.PageSize;

            var totalCount = query.Count();

            var items = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var dtoItems = _mapper.Map<List<FixtureDto>>(items);

            return new PagedResult<FixtureDto>
            {
                Items = dtoItems,
                TotalCount = totalCount,
                PageNumber = page,
                PageSize = pageSize
            };
        }
    }
}
