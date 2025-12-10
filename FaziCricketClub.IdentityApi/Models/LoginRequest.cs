using System.ComponentModel.DataAnnotations;

namespace FaziCricketClub.IdentityApi.Models
{
    /// <summary>
    /// Request payload for logging in an existing user.
    /// </summary>
    public class LoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
