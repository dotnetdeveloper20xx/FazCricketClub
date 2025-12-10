using System.ComponentModel.DataAnnotations;

namespace FaziCricketClub.IdentityApi.Models.Admin
{
    /// <summary>
    /// Request payload for adding a permission to a role.
    /// </summary>
    public class RolePermissionRequest
    {
        /// <summary>
        /// The permission value to assign, e.g. "Players.View", "Admin.ManageUsers".
        /// </summary>
        [Required]
        public string Permission { get; set; } = string.Empty;
    }
}
