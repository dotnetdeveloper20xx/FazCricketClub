namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when creating a new fixture.
    /// </summary>
    public class CreateFixtureDto
    {
        public int SeasonId { get; set; }

        public int HomeTeamId { get; set; }

        public int AwayTeamId { get; set; }

        public DateTime StartDateTime { get; set; }

        public string Venue { get; set; } = string.Empty;

        public string CompetitionName { get; set; } = string.Empty;

        public string Status { get; set; } = "Scheduled";
    }
}
