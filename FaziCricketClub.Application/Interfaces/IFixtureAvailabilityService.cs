using FaziCricketClub.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Manages player availability for fixtures.
    /// </summary>
    public interface IFixtureAvailabilityService
    {
        /// <summary>
        /// Sets or updates availability for a given member and fixture.
        /// This is an "upsert" – if a row exists, it's updated; otherwise created.
        /// </summary>
        Task<FixtureAvailabilityDto> SetAvailabilityAsync(
            int fixtureId,
            int memberId,
            FixtureAvailabilityUpsertDto request,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns all availability records for a given fixture,
        /// typically used by captains/selectors to see who is available.
        /// </summary>
        Task<IReadOnlyList<FixtureAvailabilityDto>> GetFixtureAvailabilityAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns a summary view of availability for a fixture:
        /// counts of Available / Unavailable / Maybe etc.
        /// </summary>
        Task<FixtureAvailabilitySummaryDto> GetFixtureAvailabilitySummaryAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        /// <summary>
        /// Returns future fixtures for a member along with their availability status,
        /// e.g. used in a "My Availability" page.
        /// </summary>
        Task<IReadOnlyList<FixtureAvailabilityDto>> GetMemberAvailabilityAsync(
            int memberId,
            bool upcomingOnly,
            CancellationToken cancellationToken = default);
    }
}
