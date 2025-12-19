namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when returning a member from the API.
    /// </summary>
    public class MemberDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public DateTime? DateOfBirth { get; set; }

        public DateTime JoinedOn { get; set; }

        public bool IsActive { get; set; }

        public string? Notes { get; set; }
    }
}
