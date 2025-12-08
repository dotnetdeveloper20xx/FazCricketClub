using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Aggregated fixture statistics for a single team.
    /// </summary>
    public class TeamFixtureStatsDto
    {
        public int TeamId { get; set; }

        public string TeamName { get; set; } = string.Empty;

        public int TotalFixtures { get; set; }

        public int HomeFixtures { get; set; }

        public int AwayFixtures { get; set; }

        public int CompletedFixtures { get; set; }

        public int UpcomingFixtures { get; set; }
    }
}
