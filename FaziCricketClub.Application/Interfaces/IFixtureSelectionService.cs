using FaziCricketClub.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Manages team selections (XI / squad list) for fixtures.
    /// </summary>
    public interface IFixtureSelectionService
    {
        /// <summary>
        /// Gets the selection (if any) for a given fixture.
        /// Returns null if no selection has been recorded yet.
        /// </summary>
        Task<FixtureSelectionDetailDto?> GetSelectionAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Creates or updates the team selection for a fixture.
        /// Existing selection (header + players) is replaced with the new data.
        /// </summary>
        Task<FixtureSelectionDetailDto> UpsertSelectionAsync(
            int fixtureId,
            FixtureSelectionUpsertDto request,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Deletes the selection for a fixture, if present.
        /// Does not delete the fixture or availability.
        /// </summary>
        Task DeleteSelectionAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);
    }
}
