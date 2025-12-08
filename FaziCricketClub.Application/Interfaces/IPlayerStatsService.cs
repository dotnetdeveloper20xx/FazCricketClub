using FaziCricketClub.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Provides aggregated batting and bowling statistics for players,
    /// including per-player summaries and leaderboards.
    /// </summary>
    public interface IPlayerStatsService
    {
        /// <summary>
        /// Returns batting statistics for a given player, optionally scoped to a season.
        /// If seasonId is null, stats are calculated across all seasons.
        /// </summary>
        Task<PlayerBattingStatsDto> GetBattingStatsAsync(
            int memberId,
            int? seasonId = null,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns bowling statistics for a given player, optionally scoped to a season.
        /// If seasonId is null, stats are calculated across all seasons.
        /// </summary>
        Task<PlayerBowlingStatsDto> GetBowlingStatsAsync(
            int memberId,
            int? seasonId = null,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns a batting leaderboard, ordered by total runs (and then by average / strike rate),
        /// limited to the top N players. If seasonId is null, uses all seasons.
        /// </summary>
        Task<List<PlayerBattingLeaderboardEntryDto>> GetBattingLeaderboardAsync(
            int? seasonId = null,
            int topN = 10,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns a bowling leaderboard, ordered primarily by wickets (and then by average / economy),
        /// limited to the top N players. If seasonId is null, uses all seasons.
        /// </summary>
        Task<List<PlayerBowlingLeaderboardEntryDto>> GetBowlingLeaderboardAsync(
            int? seasonId = null,
            int topN = 10,
            CancellationToken cancellationToken = default);
    }
}
