using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Services
{
    public class ClubStatsService : IClubStatsService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IFixtureRepository _fixtureRepository;
        private readonly ISeasonRepository _seasonRepository;
        private readonly ITeamRepository _teamRepository;

        public ClubStatsService(
            IMemberRepository memberRepository,
            IFixtureRepository fixtureRepository,
            ISeasonRepository seasonRepository,
            ITeamRepository teamRepository)
        {
            _memberRepository = memberRepository;
            _fixtureRepository = fixtureRepository;
            _seasonRepository = seasonRepository;
            _teamRepository = teamRepository;
        }

        public async Task<List<SeasonFixtureAverageDto>> GetSeasonFixtureAveragesAsync(
       CancellationToken cancellationToken = default)
        {
            var seasons = await _seasonRepository.GetAllAsync(cancellationToken);
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            // Group fixtures by season
            var groups = fixtures
                .GroupBy(f => f.SeasonId)
                .ToList();

            var results = new List<SeasonFixtureAverageDto>();

            foreach (var group in groups)
            {
                var seasonId = group.Key;
                var season = seasons.FirstOrDefault(s => s.Id == seasonId);

                var totalFixtures = group.Count();

                // Distinct teams that appeared in at least one fixture this season
                var distinctTeamIds = group
                    .SelectMany(f => new[] { f.HomeTeamId, f.AwayTeamId })
                    .Where(id => id != 0) // assuming 0 means “unassigned”; adjust if needed
                    .Distinct()
                    .ToList();

                var teamsWithFixtures = distinctTeamIds.Count;

                double average = 0;
                if (teamsWithFixtures > 0)
                {
                    average = totalFixtures / (double)teamsWithFixtures;
                }

                results.Add(new SeasonFixtureAverageDto
                {
                    SeasonId = seasonId,
                    SeasonName = season?.Name ?? $"Season {seasonId}",
                    TotalFixtures = totalFixtures,
                    TeamsWithFixtures = teamsWithFixtures,
                    AverageFixturesPerTeam = average
                });
            }

            // Optional: order by season name or some other criteria
            results = results
                .OrderBy(r => r.SeasonName)
                .ToList();

            return results;
        }

        public async Task<List<MemberActivityPointDto>> GetMemberActivityOverTimeAsync(
    DateTime? from,
    DateTime? to,
    bool? isActive = null,
    CancellationToken cancellationToken = default)
        {
            // Default: last 12 months, based on 'to' or now
            var now = DateTime.UtcNow;
            var effectiveTo = to ?? now;
            var effectiveFrom = from ?? effectiveTo.AddMonths(-11);

            if (effectiveFrom > effectiveTo)
            {
                (effectiveFrom, effectiveTo) = (effectiveTo, effectiveFrom);
            }

            var members = await _memberRepository.GetAllAsync(cancellationToken);

            // Assuming Member has a JoinedOn (or similar) property.
            // Replace JoinedOn with the correct property if different.
            var query = members
                .Where(m => m.JoinedOn >= effectiveFrom && m.JoinedOn <= effectiveTo)
                .AsQueryable();

            if (isActive.HasValue)
            {
                query = query.Where(m => m.IsActive == isActive.Value);
            }

            var groups = query
                .GroupBy(m => new { m.JoinedOn.Year, m.JoinedOn.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .ToList();

            var results = new List<MemberActivityPointDto>();

            foreach (var group in groups)
            {
                var total = group.Count();
                var active = group.Count(m => m.IsActive);
                var inactive = total - active;

                results.Add(new MemberActivityPointDto
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    JoinedCount = total,
                    ActiveJoinedCount = active,
                    InactiveJoinedCount = inactive
                });
            }

            return results;
        }


        public async Task<List<FixtureActivityPointDto>> GetFixtureActivityOverTimeAsync(
     DateTime? from,
     DateTime? to,
     int? seasonId = null,
     int? teamId = null,
     CancellationToken cancellationToken = default)
        {
            // Default range: last 12 months if not provided
            var now = DateTime.UtcNow;
            var effectiveTo = to ?? now;
            var effectiveFrom = from ?? effectiveTo.AddMonths(-11); // 12 months window

            if (effectiveFrom > effectiveTo)
            {
                // Swap if user accidentally reversed them
                (effectiveFrom, effectiveTo) = (effectiveTo, effectiveFrom);
            }

            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            var query = fixtures
                .Where(f => f.StartDateTime >= effectiveFrom && f.StartDateTime <= effectiveTo)
                .AsQueryable();

            if (seasonId.HasValue)
            {
                query = query.Where(f => f.SeasonId == seasonId.Value);
            }

            if (teamId.HasValue)
            {
                var id = teamId.Value;
                query = query.Where(f => f.HomeTeamId == id || f.AwayTeamId == id);
            }

            // Group by Year + Month
            var groups = query
                .GroupBy(f => new { f.StartDateTime.Year, f.StartDateTime.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .ToList();

            var results = new List<FixtureActivityPointDto>();

            foreach (var group in groups)
            {
                var total = group.Count();

                var scheduled = group.Count(f =>
                    string.Equals(f.Status, "Scheduled", StringComparison.OrdinalIgnoreCase));

                var completed = group.Count(f =>
                    string.Equals(f.Status, "Completed", StringComparison.OrdinalIgnoreCase));

                var other = total - scheduled - completed;

                results.Add(new FixtureActivityPointDto
                {
                    Year = group.Key.Year,
                    Month = group.Key.Month,
                    TotalFixtures = total,
                    ScheduledFixtures = scheduled,
                    CompletedFixtures = completed,
                    OtherFixtures = other
                });
            }

            return results;
        }

        public async Task<List<TeamFixtureStatsDto>> GetTeamFixtureStatsAsync(
    CancellationToken cancellationToken = default)
        {
            var teams = await _teamRepository.GetAllAsync(cancellationToken);
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            var now = DateTime.UtcNow;

            var results = new List<TeamFixtureStatsDto>();

            foreach (var team in teams)
            {
                var teamId = team.Id;

                var teamFixtures = fixtures
                    .Where(f => f.HomeTeamId == teamId || f.AwayTeamId == teamId)
                    .ToList();

                var total = teamFixtures.Count;

                var home = teamFixtures.Count(f => f.HomeTeamId == teamId);
                var away = teamFixtures.Count(f => f.AwayTeamId == teamId);

                var completed = teamFixtures.Count(f =>
                    string.Equals(f.Status, "Completed", StringComparison.OrdinalIgnoreCase));

                var upcoming = teamFixtures.Count(f =>
                    f.StartDateTime >= now &&
                    (string.Equals(f.Status, "Scheduled", StringComparison.OrdinalIgnoreCase) ||
                     string.Equals(f.Status, "Planned", StringComparison.OrdinalIgnoreCase) ||
                     string.IsNullOrWhiteSpace(f.Status)));

                results.Add(new TeamFixtureStatsDto
                {
                    TeamId = teamId,
                    TeamName = team.Name,
                    TotalFixtures = total,
                    HomeFixtures = home,
                    AwayFixtures = away,
                    CompletedFixtures = completed,
                    UpcomingFixtures = upcoming
                });
            }

            // Optional: order by team name
            results = results
                .OrderBy(r => r.TeamName)
                .ToList();

            return results;
        }

        public async Task<ClubStatsDto> GetClubStatsAsync(CancellationToken cancellationToken = default)
        {
            var members = await _memberRepository.GetAllAsync(cancellationToken);
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            var totalMembers = members.Count;
            var activeMembers = members.Count(m => m.IsActive);
            var inactiveMembers = totalMembers - activeMembers;

            var totalFixtures = fixtures.Count;

            var scheduledFixtures = fixtures.Count(f =>
                string.Equals(f.Status, "Scheduled", StringComparison.OrdinalIgnoreCase));
            var completedFixtures = fixtures.Count(f =>
                string.Equals(f.Status, "Completed", StringComparison.OrdinalIgnoreCase));

            return new ClubStatsDto
            {
                TotalMembers = totalMembers,
                ActiveMembers = activeMembers,
                InactiveMembers = inactiveMembers,
                TotalFixtures = totalFixtures,
                ScheduledFixtures = scheduledFixtures,
                CompletedFixtures = completedFixtures
            };
        }

        public async Task<List<SeasonFixtureStatsDto>> GetSeasonFixtureStatsAsync(
            CancellationToken cancellationToken = default)
        {
            var seasons = await _seasonRepository.GetAllAsync(cancellationToken);
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            // Group fixtures by SeasonId
            var grouped = fixtures
                .GroupBy(f => f.SeasonId)
                .ToList();

            var results = new List<SeasonFixtureStatsDto>();

            foreach (var group in grouped)
            {
                var seasonId = group.Key;

                var season = seasons.FirstOrDefault(s => s.Id == seasonId);

                var total = group.Count();

                var scheduled = group.Count(f =>
                    string.Equals(f.Status, "Scheduled", StringComparison.OrdinalIgnoreCase));

                var completed = group.Count(f =>
                    string.Equals(f.Status, "Completed", StringComparison.OrdinalIgnoreCase));

                var other = total - scheduled - completed;

                results.Add(new SeasonFixtureStatsDto
                {
                    SeasonId = seasonId,
                    SeasonName = season?.Name ?? $"Season {seasonId}",
                    TotalFixtures = total,
                    ScheduledFixtures = scheduled,
                    CompletedFixtures = completed,
                    OtherFixtures = other
                });
            }

            // Optional: order by season start date or name
            results = results
                .OrderBy(r => r.SeasonName)
                .ToList();

            return results;
        }
    }
}
