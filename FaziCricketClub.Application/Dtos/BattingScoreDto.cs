using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a single player's batting performance in a fixture.
    /// Used in match result payloads.
    /// </summary>
    public class BattingScoreDto
    {
        public int TeamId { get; set; }

        public int MemberId { get; set; }

        /// <summary>
        /// Batting position (1-based).
        /// </summary>
        public int BattingOrder { get; set; }

        public int Runs { get; set; }

        public int Balls { get; set; }

        public int Fours { get; set; }

        public int Sixes { get; set; }

        public bool IsOut { get; set; }

        public string? DismissalType { get; set; }

        public int? DismissalBowlerMemberId { get; set; }

        public int? DismissalFielderMemberId { get; set; }

        public string? Notes { get; set; }
    }
}
