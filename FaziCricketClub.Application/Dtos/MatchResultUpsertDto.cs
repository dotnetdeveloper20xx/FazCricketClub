using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Payload used to create or update a match result and its scorecards.
    /// </summary>
    public class MatchResultUpsertDto
    {
        // --- Fixture-level summary ---

        public int? HomeTeamRuns { get; set; }

        public int? HomeTeamWickets { get; set; }

        public decimal? HomeTeamOvers { get; set; }

        public int? AwayTeamRuns { get; set; }

        public int? AwayTeamWickets { get; set; }

        public decimal? AwayTeamOvers { get; set; }

        /// <summary>
        /// Human-readable summary, e.g. "Home won by 25 runs".
        /// </summary>
        [MaxLength(200)]
        public string? ResultSummary { get; set; }

        /// <summary>
        /// Optional winning team id.
        /// </summary>
        public int? WinningTeamId { get; set; }

        /// <summary>
        /// Optional player of the match member id.
        /// </summary>
        public int? PlayerOfTheMatchMemberId { get; set; }

        [MaxLength(1000)]
        public string? Notes { get; set; }

        // --- Scorecards ---

        /// <summary>
        /// Batting card entries for both teams.
        /// Caller must set TeamId appropriately.
        /// </summary>
        public List<BattingScoreDto> BattingScores { get; set; } = new();

        /// <summary>
        /// Bowling figures for both teams.
        /// Caller must set TeamId appropriately.
        /// </summary>
        public List<BowlingFigureDto> BowlingFigures { get; set; } = new();
    }
}
