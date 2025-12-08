using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Detailed match result including fixture summary and scorecards.
    /// </summary>
    public class MatchResultDetailDto
    {
        public int FixtureId { get; set; }

        public int MatchResultId { get; set; }

        // Fixture-level info
        public int? HomeTeamRuns { get; set; }

        public int? HomeTeamWickets { get; set; }

        public decimal? HomeTeamOvers { get; set; }

        public int? AwayTeamRuns { get; set; }

        public int? AwayTeamWickets { get; set; }

        public decimal? AwayTeamOvers { get; set; }

        public string? ResultSummary { get; set; }

        public int? WinningTeamId { get; set; }

        public int? PlayerOfTheMatchMemberId { get; set; }

        public string? Notes { get; set; }

        // Scorecards
        public List<BattingScoreDto> BattingScores { get; set; } = new();

        public List<BowlingFigureDto> BowlingFigures { get; set; } = new();
    }
}
