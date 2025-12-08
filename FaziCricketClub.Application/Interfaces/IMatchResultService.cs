using FaziCricketClub.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Handles creation, updating, retrieval and deletion of match results
    /// and their associated scorecards (batting/bowling).
    /// </summary>
    public interface IMatchResultService
    {
        /// <summary>
        /// Retrieves the match result and scorecards for a given fixture.
        /// Returns null if no result has been recorded yet.
        /// </summary>
        Task<MatchResultDetailDto?> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates or updates the match result and scorecards for a fixture.
        /// If a result already exists, it is replaced with the new data.
        /// Also responsible for marking the fixture as completed.
        /// </summary>
        Task<MatchResultDetailDto> UpsertMatchResultAsync(
            int fixtureId,
            MatchResultUpsertDto request,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Deletes the match result and scorecards for the given fixture,
        /// if present. Does not delete the fixture itself.
        /// </summary>
        Task DeleteMatchResultAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);
    }
}
