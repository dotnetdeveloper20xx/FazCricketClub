using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents the official team selection for a fixture
    /// (e.g., final XI / squad list, captain, wicket-keeper).
    /// </summary>
    public class FixtureSelection
    {
        public int Id { get; set; }

        /// <summary>
        /// The fixture this selection belongs to (1:1 relationship).
        /// </summary>
        public int FixtureId { get; set; }

        public Fixture Fixture { get; set; } = null!;

        /// <summary>
        /// Optional: member who is captain for this fixture.
        /// </summary>
        public int? CaptainMemberId { get; set; }

        /// <summary>
        /// Optional: member who is wicket-keeper for this fixture.
        /// </summary>
        public int? WicketKeeperMemberId { get; set; }

        /// <summary>
        /// Free-form notes about selection (e.g., tactics, rotation policy).
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// When the selection was created/last confirmed.
        /// </summary>
        public DateTimeOffset CreatedAt { get; set; }

        public ICollection<FixtureSelectionPlayer> Players { get; set; } = new List<FixtureSelectionPlayer>();
    }
}
