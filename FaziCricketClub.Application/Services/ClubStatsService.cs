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

        public ClubStatsService(
            IMemberRepository memberRepository,
            IFixtureRepository fixtureRepository,
            ISeasonRepository seasonRepository)
        {
            _memberRepository = memberRepository;
            _fixtureRepository = fixtureRepository;
            _seasonRepository = seasonRepository;
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
