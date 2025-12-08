using FaziCricketClub.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Provides high-level statistics for the club.
    /// </summary>
    public interface IClubStatsService
    {
        /// <summary>
        /// Calculates club-wide statistics for members and fixtures.
        /// </summary>
        Task<ClubStatsDto> GetClubStatsAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns aggregated fixture statistics grouped by season.
        /// </summary>
        Task<List<SeasonFixtureStatsDto>> GetSeasonFixtureStatsAsync(
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns aggregated fixture statistics grouped by team.
        /// </summary>
        Task<List<TeamFixtureStatsDto>> GetTeamFixtureStatsAsync(
            CancellationToken cancellationToken = default);
    }
}
