using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a single player's batting performance in a fixture.
    /// Typically one entry per batter per innings.
    /// </summary>
    public class BattingScore
    {
        public int Id { get; set; }

        public int FixtureId { get; set; }

        public Fixture Fixture { get; set; } = null!;

        /// <summary>
        /// The team this batter was playing for in this fixture.
        /// </summary>
        public int TeamId { get; set; }

        /// <summary>
        /// The member (player) who batted.
        /// </summary>
        public int MemberId { get; set; }

        public Member Member { get; set; } = null!;

        /// <summary>
        /// Batting position in the order (1-based).
        /// </summary>
        public int BattingOrder { get; set; }

        /// <summary>
        /// Number of runs scored.
        /// </summary>
        public int Runs { get; set; }

        /// <summary>
        /// Balls faced.
        /// </summary>
        public int Balls { get; set; }

        /// <summary>
        /// Number of 4s hit.
        /// </summary>
        public int Fours { get; set; }

        /// <summary>
        /// Number of 6s hit.
        /// </summary>
        public int Sixes { get; set; }

        /// <summary>
        /// True if the batter was out, false if not out.
        /// </summary>
        public bool IsOut { get; set; }

        /// <summary>
        /// Optional dismissal type, e.g. "bowled", "lbw", "caught".
        /// </summary>
        public string? DismissalType { get; set; }

        /// <summary>
        /// Optional bowler responsible for the dismissal.
        /// </summary>
        public int? DismissalBowlerMemberId { get; set; }

        /// <summary>
        /// Optional fielder credited with a catch/run-out.
        /// </summary>
        public int? DismissalFielderMemberId { get; set; }

        /// <summary>
        /// Free-form notes, e.g. "Retired hurt", "Run out backing up".
        /// </summary>
        public string? Notes { get; set; }
    }
}
