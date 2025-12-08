using FaziCricketClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Repository for batting scorecard entries.
    /// </summary>
    public interface IBattingScoreRepository
    {
        Task<List<BattingScore>> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        Task AddRangeAsync(
            IEnumerable<BattingScore> entities,
            CancellationToken cancellationToken = default);

        void RemoveRange(IEnumerable<BattingScore> entities);

        /// <summary>
        /// Returns batting score entries for stats calculations.
        /// If seasonId is provided, only scores from fixtures in that season are returned.
        /// </summary>
        Task<List<BattingScore>> GetForStatsAsync(
            int? seasonId,
            CancellationToken cancellationToken = default);
    }
}
