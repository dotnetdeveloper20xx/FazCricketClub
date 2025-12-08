using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Payload used to create or update the team selection for a fixture.
    /// Includes header information and the list of selected players.
    /// </summary>
    public class FixtureSelectionUpsertDto
    {
        /// <summary>
        /// Optional captain for this fixture.
        /// </summary>
        public int? CaptainMemberId { get; set; }

        /// <summary>
        /// Optional wicket-keeper for this fixture.
        /// </summary>
        public int? WicketKeeperMemberId { get; set; }

        /// <summary>
        /// Free-form notes about selection (tactics, rotation, etc.).
        /// </summary>
        [MaxLength(1000)]
        public string? Notes { get; set; }

        /// <summary>
        /// Selected players (XI / squad).
        /// MemberName is optional for input; we mainly need MemberId and flags.
        /// </summary>
        [Required]
        public List<FixtureSelectionPlayerDto> Players { get; set; } = new();
    }
}
