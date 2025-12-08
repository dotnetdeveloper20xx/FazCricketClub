using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Default implementation of <see cref="IClubStatsService"/>.
    /// Aggregates data from repositories to produce simple dashboard stats.
    /// </summary>
    public class ClubStatsService : IClubStatsService
    {
        private readonly IMemberRepository _memberRepository;
        private readonly IFixtureRepository _fixtureRepository;

        public ClubStatsService(
            IMemberRepository memberRepository,
            IFixtureRepository fixtureRepository)
        {
            _memberRepository = memberRepository;
            _fixtureRepository = fixtureRepository;
        }

        public async Task<ClubStatsDto> GetClubStatsAsync(CancellationToken cancellationToken = default)
        {
            var members = await _memberRepository.GetAllAsync(cancellationToken);
            var fixtures = await _fixtureRepository.GetAllAsync(cancellationToken);

            var totalMembers = members.Count;
            var activeMembers = members.Count(m => m.IsActive);
            var inactiveMembers = totalMembers - activeMembers;

            var totalFixtures = fixtures.Count;

            // Using Status string for now; could be normalized later to an enum.
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
    }
}
