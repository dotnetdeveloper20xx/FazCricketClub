namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when creating a new member.
    /// </summary>
    public class CreateMemberDto
    {
        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public bool IsActive { get; set; } = true;

        public string? Notes { get; set; }
    }
}
