using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a single row in the bowling leaderboard.
    /// </summary>
    public class PlayerBowlingLeaderboardEntryDto
    {
        public int Rank { get; set; }

        public int MemberId { get; set; }

        public string MemberName { get; set; } = string.Empty;

        public int? SeasonId { get; set; }

        public string? SeasonName { get; set; }

        public int Matches { get; set; }

        public decimal Overs { get; set; }

        public int RunsConceded { get; set; }

        public int Wickets { get; set; }

        public decimal? Average { get; set; }

        public decimal? Economy { get; set; }

        public decimal? StrikeRate { get; set; }

        public string? BestFigures { get; set; }
    }
}
