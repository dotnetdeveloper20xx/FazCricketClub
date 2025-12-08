using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Aggregated fixture statistics for a single season.
    /// </summary>
    public class SeasonFixtureStatsDto
    {
        public int SeasonId { get; set; }

        public string SeasonName { get; set; } = string.Empty;

        public int TotalFixtures { get; set; }

        public int ScheduledFixtures { get; set; }

        public int CompletedFixtures { get; set; }

        public int OtherFixtures { get; set; }
    }
}
