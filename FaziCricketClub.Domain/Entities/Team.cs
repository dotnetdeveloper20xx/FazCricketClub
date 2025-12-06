namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a team within the cricket club, such as "1st XI", "2nd XI", or "U19".
    /// </summary>
    public class Team
    {
        /// <summary>
        /// Primary key for the team.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The display name of the team (e.g., "1st XI", "U19").
        /// </summary>
        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Optional description or notes about the team.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Indicates if the team is currently active / participating.
        /// </summary>
        public bool IsActive { get; set; } = true;

        /// <summary>
        /// Members associated with this team (many-to-many with Member).
        /// </summary>
        public ICollection<Member> Members { get; set; } = new List<Member>();

        /// <summary>
        /// Fixtures where this team is the home team.
        /// </summary>
        public ICollection<Fixture> HomeFixtures { get; set; } = new List<Fixture>();

        /// <summary>
        /// Fixtures where this team is the away team.
        /// </summary>
        public ICollection<Fixture> AwayFixtures { get; set; } = new List<Fixture>();
    }
}
