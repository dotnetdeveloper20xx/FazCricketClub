using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a single selected player in a fixture selection (XI / squad).
    /// </summary>
    public class FixtureSelectionPlayerDto
    {
        public int MemberId { get; set; }

        public string MemberName { get; set; } = string.Empty;

        /// <summary>
        /// Batting position (1-based). Null if not set yet.
        /// </summary>
        public int? BattingOrder { get; set; }

        /// <summary>
        /// Role description, e.g. "Batter", "Bowler", "All-Rounder", "WK".
        /// </summary>
        public string? Role { get; set; }

        /// <summary>
        /// True if the player is in the final XI. False for extended squad / reserves.
        /// </summary>
        public bool IsPlaying { get; set; } = true;

        public string? Notes { get; set; }
    }
}
