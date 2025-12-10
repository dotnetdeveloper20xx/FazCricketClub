namespace FaziCricketClub.IdentityApi.Models
{
    /// <summary>
    /// Standard response after successful authentication/registration.
    /// Contains the issued JWT token and basic identity data.
    /// </summary>
    public class AuthResponse
    {
        /// <summary>
        /// The issued JWT bearer token.
        /// </summary>
        public string AccessToken { get; set; } = string.Empty;

        /// <summary>
        /// UTC timestamp when the token expires.
        /// </summary>
        public DateTime ExpiresAtUtc { get; set; }

        /// <summary>
        /// The user's unique identifier.
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// The username associated with the account.
        /// </summary>
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// The email associated with the account.
        /// </summary>
        public string Email { get; set; } = string.Empty;
    }
}
