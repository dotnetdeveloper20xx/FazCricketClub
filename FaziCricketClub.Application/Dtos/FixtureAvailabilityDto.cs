using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a player's availability for a specific fixture.
    /// Returned when querying fixture availability.
    /// </summary>
    public class FixtureAvailabilityDto
    {
        public int Id { get; set; }

        public int FixtureId { get; set; }

        public int MemberId { get; set; }

        public string MemberName { get; set; } = string.Empty;

        public string Status { get; set; } = string.Empty;

        public string? Notes { get; set; }

        public DateTimeOffset UpdatedAt { get; set; }
    }
}
