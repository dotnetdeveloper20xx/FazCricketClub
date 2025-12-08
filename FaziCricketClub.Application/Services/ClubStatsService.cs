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
