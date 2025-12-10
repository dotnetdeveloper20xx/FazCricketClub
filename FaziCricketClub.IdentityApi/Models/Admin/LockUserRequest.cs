using System.ComponentModel.DataAnnotations;

namespace FaziCricketClub.IdentityApi.Models.Admin
{
    /// <summary>
    /// Request payload for locking a user account.
    /// </summary>
    public class LockUserRequest
    {
        /// <summary>
        /// Number of minutes to lock the user out for.
        /// Defaults to 15 if not specified or invalid.
        /// </summary>
        [Range(1, 1440, ErrorMessage = "Lockout duration must be between 1 and 1440 minutes.")]
        public int? Minutes { get; set; }
    }
}
