using System.ComponentModel.DataAnnotations;

namespace FaziCricketClub.IdentityApi.Models.Admin
{
    /// <summary>
    /// Request payload for assigning a role to a user.
    /// </summary>
    public class AssignRoleRequest
    {
        /// <summary>
        /// Name of the role to assign (e.g. "Admin", "Captain", "Player").
        /// </summary>
        [Required]
        public string RoleName { get; set; } = string.Empty;
    }
}
