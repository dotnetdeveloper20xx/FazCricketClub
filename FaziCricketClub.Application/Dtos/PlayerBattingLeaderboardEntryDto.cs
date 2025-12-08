using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a single row in the batting leaderboard.
    /// </summary>
    public class PlayerBattingLeaderboardEntryDto
    {
        public int Rank { get; set; }

        public int MemberId { get; set; }

        public string MemberName { get; set; } = string.Empty;

        public int? SeasonId { get; set; }

        public string? SeasonName { get; set; }

        public int Matches { get; set; }

        public int Innings { get; set; }

        public int Runs { get; set; }

        public decimal? Average { get; set; }

        public decimal? StrikeRate { get; set; }

        public int HighScore { get; set; }

        public int Fifties { get; set; }

        public int Hundreds { get; set; }
    }
}
