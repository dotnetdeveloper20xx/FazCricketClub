namespace FaziCricketClub.IdentityApi.Models.Admin
{
    /// <summary>
    /// Lightweight user representation for admin APIs.
    /// Exposes enough data for management screens:
    /// - User Id, Email, UserName
    /// - Lockout flag
    /// - List of roles.
    /// </summary>
    public class UserDto
    {
        public Guid Id { get; set; }

        public string UserName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public bool IsLockedOut { get; set; }

        public List<string> Roles { get; set; } = new();
    }
}
