using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a selected player in a fixture selection, including
    /// their batting order and role.
    /// </summary>
    public class FixtureSelectionPlayer
    {
        public int Id { get; set; }

        public int FixtureSelectionId { get; set; }

        public FixtureSelection FixtureSelection { get; set; } = null!;

        /// <summary>
        /// The selected member.
        /// </summary>
        public int MemberId { get; set; }

        public Member Member { get; set; } = null!;

        /// <summary>
        /// Batting position (1-based). Optional: can be null if not finalised.
        /// </summary>
        public int? BattingOrder { get; set; }

        /// <summary>
        /// Role in the team, e.g. "Batter", "Bowler", "All-Rounder", "WK".
        /// </summary>
        public string? Role { get; set; }

        /// <summary>
        /// Indicates if this player is part of the final XI (vs extended squad).
        /// </summary>
        public bool IsPlaying { get; set; } = true;

        /// <summary>
        /// Optional notes about this selection (e.g. "12th man", "Cover for injury").
        /// </summary>
        public string? Notes { get; set; }
    }
}
