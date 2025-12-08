using FaziCricketClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    public interface IBowlingFigureRepository
    {
        Task<List<BowlingFigure>> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        Task AddRangeAsync(
            IEnumerable<BowlingFigure> entities,
            CancellationToken cancellationToken = default);

        void RemoveRange(IEnumerable<BowlingFigure> entities);

        /// <summary>
        /// Returns bowling figure entries for stats calculations.
        /// If seasonId is provided, only figures from fixtures in that season are returned.
        /// </summary>
        Task<List<BowlingFigure>> GetForStatsAsync(
            int? seasonId,
            CancellationToken cancellationToken = default);
    }
}
