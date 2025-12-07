namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when returning a team from the API.
    /// </summary>
    public class TeamDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; }
    }
}
