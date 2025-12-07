namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when creating a new team.
    /// </summary>
    public class CreateTeamDto
    {
        public string Name { get; set; } = string.Empty;

        public string? Description { get; set; }

        public bool IsActive { get; set; } = true;
    }
}
