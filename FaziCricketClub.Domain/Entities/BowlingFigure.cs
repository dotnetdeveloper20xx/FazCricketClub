using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a single player's bowling performance in a fixture.
    /// Typically one entry per bowler per innings.
    /// </summary>
    public class BowlingFigure
    {
        public int Id { get; set; }

        public int FixtureId { get; set; }

        public Fixture Fixture { get; set; } = null!;

        /// <summary>
        /// The team this bowler was playing for in this fixture.
        /// </summary>
        public int TeamId { get; set; }

        /// <summary>
        /// The member (player) who bowled.
        /// </summary>
        public int MemberId { get; set; }

        public Member Member { get; set; } = null!;

        /// <summary>
        /// Overs bowled (decimal style, e.g. 4.0, 3.2).
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
        /// No balls bowled.
        /// </summary>
        public int NoBalls { get; set; }

        /// <summary>
        /// Wides bowled.
        /// </summary>
        public int Wides { get; set; }

        /// <summary>
        /// Optional notes, e.g. "Opened bowling from pavilion end".
        /// </summary>
        public string? Notes { get; set; }
    }
}
