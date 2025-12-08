using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Aggregated fixture statistics per season, including
    /// average fixtures per team in that season.
    /// </summary>
    public class SeasonFixtureAverageDto
    {
        public int SeasonId { get; set; }

        public string SeasonName { get; set; } = string.Empty;

        /// <summary>
        /// Total fixtures in this season.
        /// </summary>
        public int TotalFixtures { get; set; }

        /// <summary>
        /// Number of distinct teams that appeared in at least one fixture in this season.
        /// </summary>
        public int TeamsWithFixtures { get; set; }

        /// <summary>
        /// Average fixtures per team for this season.
        /// Calculated as TotalFixtures / TeamsWithFixtures.
        /// </summary>
        public double AverageFixturesPerTeam { get; set; }
    }
}
