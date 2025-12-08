using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Aggregated batting statistics for a player, optionally scoped to a season.
    /// </summary>
    public class PlayerBattingStatsDto
    {
        public int MemberId { get; set; }

        public string MemberName { get; set; } = string.Empty;

        public int? SeasonId { get; set; }

        public string? SeasonName { get; set; }

        /// <summary>
        /// Number of fixtures in which the player has at least one batting entry.
        /// </summary>
        public int Matches { get; set; }

        /// <summary>
        /// Number of innings the player has batted.
        /// </summary>
        public int Innings { get; set; }

        /// <summary>
        /// Number of innings where the player was not out.
        /// </summary>
        public int NotOuts { get; set; }

        /// <summary>
        /// Total runs scored.
        /// </summary>
        public int Runs { get; set; }

        /// <summary>
        /// Highest score in a single innings.
        /// </summary>
        public int HighScore { get; set; }

        /// <summary>
        /// Batting average = Runs / (Innings - NotOuts).
        /// </summary>
        public decimal? Average { get; set; }

        /// <summary>
        /// Strike rate = (Runs / BallsFaced) * 100.
        /// </summary>
        public decimal? StrikeRate { get; set; }

        /// <summary>
        /// Total balls faced across all innings.
        /// </summary>
        public int BallsFaced { get; set; }

        /// <summary>
        /// Total number of 4s hit.
        /// </summary>
        public int Fours { get; set; }

        /// <summary>
        /// Total number of 6s hit.
        /// </summary>
        public int Sixes { get; set; }

        /// <summary>
        /// Count of innings with 50–99 runs.
        /// </summary>
        public int Fifties { get; set; }

        /// <summary>
        /// Count of innings with 100+ runs.
        /// </summary>
        public int Hundreds { get; set; }
    }
}
