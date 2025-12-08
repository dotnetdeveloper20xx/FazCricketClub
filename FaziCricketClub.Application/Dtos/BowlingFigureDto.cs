using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a single player's bowling performance in a fixture.
    /// Used in match result payloads.
    /// </summary>
    public class BowlingFigureDto
    {
        public int TeamId { get; set; }

        public int MemberId { get; set; }

        /// <summary>
        /// Overs bowled (e.g. 4.0, 3.2).
        /// </summary>
        public decimal Overs { get; set; }

        public int Maidens { get; set; }

        public int RunsConceded { get; set; }

        public int Wickets { get; set; }

        public int NoBalls { get; set; }

        public int Wides { get; set; }

        public string? Notes { get; set; }
    }
}
