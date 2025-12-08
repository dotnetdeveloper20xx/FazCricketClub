using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Payload used by a player to set or update their availability
    /// for a specific fixture.
    /// </summary>
    public class FixtureAvailabilityUpsertDto
    {
        /// <summary>
        /// Availability status.
        /// Suggested values: "Available", "Unavailable", "Maybe".
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = "Available";

        /// <summary>
        /// Optional free-form note, e.g. "Arriving late", "Need to leave by 6pm".
        /// </summary>
        [MaxLength(500)]
        public string? Notes { get; set; }
    }
}
