using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a player's availability response for a specific fixture.
    /// </summary>
    public class FixtureAvailability : BaseEntity // or whatever your base is
    {
        public int Id { get; set; }

        /// <summary>
        /// The fixture the availability relates to.
        /// </summary>
        public int FixtureId { get; set; }

        public Fixture Fixture { get; set; } = null!;

        /// <summary>
        /// The member providing the availability response.
        /// </summary>
        public int MemberId { get; set; }

        public Member Member { get; set; } = null!;

        /// <summary>
        /// Availability status: e.g. "Available", "Unavailable", "Maybe".
        /// </summary>
        public string Status { get; set; } = "Available";

        /// <summary>
        /// Optional free-form note, e.g. "Arriving late", "Need to leave early".
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// When the player last updated their availability.
        /// </summary>
        public DateTimeOffset UpdatedAt { get; set; }
    }
}
