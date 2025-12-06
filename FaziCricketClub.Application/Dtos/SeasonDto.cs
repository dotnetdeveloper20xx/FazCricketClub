namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when returning a season from the API.
    /// </summary>
    public class SeasonDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }
    }
}
