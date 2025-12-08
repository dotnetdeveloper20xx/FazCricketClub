using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Detailed view of a fixture's team selection, including players and roles.
    /// </summary>
    public class FixtureSelectionDetailDto
    {
        public int FixtureId { get; set; }

        public int SelectionId { get; set; }

        public int? CaptainMemberId { get; set; }

        public string? CaptainName { get; set; }

        public int? WicketKeeperMemberId { get; set; }

        public string? WicketKeeperName { get; set; }

        public string? Notes { get; set; }

        public DateTimeOffset CreatedAt { get; set; }

        /// <summary>
        /// Selected players, typically ordered by IsPlaying desc then BattingOrder.
        /// </summary>
        public List<FixtureSelectionPlayerDto> Players { get; set; } = new();
    }
}
