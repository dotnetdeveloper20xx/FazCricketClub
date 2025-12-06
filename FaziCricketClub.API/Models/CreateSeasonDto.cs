namespace FaziCricketClub.API.Models
{
    /// <summary>
    /// DTO used when creating a new season.
    /// </summary>
    public class CreateSeasonDto
    {
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
