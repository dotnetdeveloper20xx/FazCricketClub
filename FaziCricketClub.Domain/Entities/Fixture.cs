namespace FaziCricketClub.Domain.Entities
{
    /// <summary>
    /// Represents a scheduled match (fixture) between two teams in a given season.
    /// </summary>
    public class Fixture
    {
        /// <summary>
        /// Primary key for the fixture.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Foreign key to the season this fixture belongs to.
        /// </summary>
        public int SeasonId { get; set; }

        /// <summary>
        /// Navigation to the season.
        /// </summary>
        public Season? Season { get; set; }

        /// <summary>
        /// Foreign key to the home team.
        /// </summary>
        public int HomeTeamId { get; set; }

        /// <summary>
        /// Navigation to the home team.
        /// </summary>
        public Team? HomeTeam { get; set; }

        /// <summary>
        /// Foreign key to the away team.
        /// </summary>
        public int AwayTeamId { get; set; }

        /// <summary>
        /// Navigation to the away team.
        /// </summary>
        public Team? AwayTeam { get; set; }

        /// <summary>
        /// The date and time when the fixture is scheduled to start.
        /// </summary>
        public DateTime StartDateTime { get; set; }

        /// <summary>
        /// The ground or venue where the match is played.
        /// </summary>
        public string Venue { get; set; } = string.Empty;

        /// <summary>
        /// Text description of the competition (league, cup, friendly).
        /// </summary>
        public string CompetitionName { get; set; } = string.Empty;

        /// <summary>
        /// Current status of the fixture (Scheduled, Completed, Abandoned, etc.).
        /// </summary>
        public string Status { get; set; } = "Scheduled";

        /// <summary>
        /// Indicates that the row has been soft deleted.
        /// True means logically deleted; it should not appear in normal queries.
        /// </summary>
        public bool IsDeleted { get; set; } = false;
    }
}
