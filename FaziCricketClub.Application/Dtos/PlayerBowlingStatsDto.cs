using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Aggregated bowling statistics for a player, optionally scoped to a season.
    /// </summary>
    public class PlayerBowlingStatsDto
    {
        public int MemberId { get; set; }

        public string MemberName { get; set; } = string.Empty;

        public int? SeasonId { get; set; }

        public string? SeasonName { get; set; }

        /// <summary>
        /// Number of fixtures in which the player has at least one bowling entry.
        /// </summary>
        public int Matches { get; set; }

        /// <summary>
        /// Total overs bowled (e.g. 23.4).
        /// </summary>
        public decimal Overs { get; set; }

        /// <summary>
        /// Maidens bowled.
        /// </summary>
        public int Maidens { get; set; }

        /// <summary>
        /// Runs conceded.
        /// </summary>
        public int RunsConceded { get; set; }

        /// <summary>
        /// Wickets taken.
        /// </summary>
        public int Wickets { get; set; }

        /// <summary>
        /// Bowling average = RunsConceded / Wickets.
        /// </summary>
        public decimal? Average { get; set; }

        /// <summary>
        /// Economy rate = RunsConceded / Overs.
        /// </summary>
        public decimal? Economy { get; set; }

        /// <summary>
        /// Bowling strike rate = Balls bowled / Wickets.
        /// </summary>
        public decimal? StrikeRate { get; set; }

        /// <summary>
        /// Best bowling in an innings, e.g., "5/27".
        /// Stored as a string for easy display.
        /// </summary>
        public string? BestFigures { get; set; }

        /// <summary>
        /// Count of 4-wicket hauls.
        /// </summary>
        public int FourWicketHauls { get; set; }

        /// <summary>
        /// Count of 5-wicket (or more) hauls.
        /// </summary>
        public int FiveWicketHauls { get; set; }
    }
}
