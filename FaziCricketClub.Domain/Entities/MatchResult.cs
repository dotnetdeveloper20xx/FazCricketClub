using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents the final result of a cricket fixture, including scores
    /// and basic outcome information.
    /// </summary>
    public class MatchResult
    {
        public int Id { get; set; }

        /// <summary>
        /// The fixture this result belongs to (1:1 relationship).
        /// </summary>
        public int FixtureId { get; set; }

        public Fixture Fixture { get; set; } = null!;

        /// <summary>
        /// Runs scored by the home team.
        /// </summary>
        public int? HomeTeamRuns { get; set; }

        /// <summary>
        /// Wickets lost by the home team (0-10).
        /// </summary>
        public int? HomeTeamWickets { get; set; }

        /// <summary>
        /// Overs faced by the home team (stored as decimal, e.g., 20.0 or 19.4).
        /// </summary>
        public decimal? HomeTeamOvers { get; set; }

        /// <summary>
        /// Runs scored by the away team.
        /// </summary>
        public int? AwayTeamRuns { get; set; }

        /// <summary>
        /// Wickets lost by the away team (0-10).
        /// </summary>
        public int? AwayTeamWickets { get; set; }

        /// <summary>
        /// Overs faced by the away team (stored as decimal).
        /// </summary>
        public decimal? AwayTeamOvers { get; set; }

        /// <summary>
        /// Short description of the result, e.g.
        /// "Home won by 25 runs", "Away won by 6 wickets", "Match tied".
        /// </summary>
        public string? ResultSummary { get; set; }

        /// <summary>
        /// Optional: the winning team id (if applicable).
        /// </summary>
        public int? WinningTeamId { get; set; }

        /// <summary>
        /// Optional: player of the match (MemberId) if recorded.
        /// </summary>
        public int? PlayerOfTheMatchMemberId { get; set; }

        /// <summary>
        /// Free-form notes about the game (pitch, weather, etc.).
        /// </summary>
        public string? Notes { get; set; }
    }
}
