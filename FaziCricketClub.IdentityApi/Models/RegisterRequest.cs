using System.ComponentModel.DataAnnotations;

namespace FaziCricketClub.IdentityApi.Models
{
    /// <summary>
    /// Request payload for registering a new user.
    /// This DTO intentionally keeps only the essential fields.
    /// You can extend it with FirstName, LastName, etc. later.
    /// </summary>
    public class RegisterRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Optional explicit username. If not provided, we can use Email as UserName.
        /// </summary>
        public string? UserName { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [Compare(nameof(Password), ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        /// <summary>
        /// Optional role to assign on registration (e.g., "Player").
        /// In many systems this would be controlled server-side.
        /// </summary>
        public string? Role { get; set; }
    }
}
