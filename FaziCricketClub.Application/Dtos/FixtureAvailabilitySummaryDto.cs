using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// High-level availability overview for a fixture.
    /// Useful for captain dashboards.
    /// </summary>
    public class FixtureAvailabilitySummaryDto
    {
        public int FixtureId { get; set; }

        public string FixtureName { get; set; } = string.Empty;

        public DateTimeOffset FixtureDate { get; set; }

        public int AvailableCount { get; set; }

        public int UnavailableCount { get; set; }

        public int MaybeCount { get; set; }

        /// <summary>
        /// Optional note for quick captain judgement, e.g. "Squad OK" or "Need more players".
        /// </summary>
        public string? SummaryNote { get; set; }
    }
}
