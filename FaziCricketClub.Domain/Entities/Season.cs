namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a cricket season, such as "2025 Summer".
    /// Seasons are used to group fixtures, stats, and memberships.
    /// </summary>
    public class Season
    {
        /// <summary>
        /// Primary key for the season.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Human-friendly name for the season (e.g., "2025 Summer").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional description with any additional details about the season.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// When the season starts.
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// When the season ends.
        /// </summary>
        public DateTime EndDate { get; set; }

        /// <summary>
        /// Indicates that the row has been soft deleted.
        /// True means logically deleted; it should not appear in normal queries.
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Fixtures that belong to this season.
        /// </summary>
        public ICollection<Fixture> Fixtures { get; set; } = new List<Fixture>();
    }
}
