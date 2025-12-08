namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a person who is part of the cricket club,
    /// such as a player, captain, coach, or committee member.
    /// </summary>
    public class Member
    {
        /// <summary>
        /// Primary key for the member.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The full display name of the member.
        /// </summary>
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Email address used for login/communication.
        /// </summary>
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Optional phone number for contact.
        /// </summary>
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// Date of birth (optional). Can be used for age-group teams.
        /// </summary>
        public DateTime? DateOfBirth { get; set; }

        /// <summary>
        /// Whether the member is currently active in the club.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Optional notes about the member (e.g., batting/bowling style).
        /// </summary>
        public string? Notes { get; set; }

        /// <summary>
        /// Indicates that the row has been soft deleted.
        /// True means logically deleted; it should not appear in normal queries.
        /// </summary>
        public bool IsDeleted { get; set; } = false;

        /// <summary>
        /// Teams the member belongs to (many-to-many via a join entity later).
        /// </summary>
        public ICollection<Team> Teams { get; set; } = new List<Team>();

        public ICollection<BattingScore> BattingScores { get; set; } = new List<BattingScore>();

        public ICollection<BowlingFigure> BowlingFigures { get; set; } = new List<BowlingFigure>();

        public ICollection<FixtureAvailability> FixtureAvailabilities { get; set; } = new List<FixtureAvailability>();

        public ICollection<FixtureSelectionPlayer> FixtureSelections { get; set; } = new List<FixtureSelectionPlayer>();


    }
}
