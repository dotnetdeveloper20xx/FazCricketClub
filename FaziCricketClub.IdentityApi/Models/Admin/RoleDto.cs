namespace FaziCricketClub.IdentityApi.Models.Admin
{
    /// <summary>
    /// Lightweight role representation for admin APIs.
    /// Exposes:
    /// - Role Id
    /// - Role Name
    /// - List of associated permissions.
    /// </summary>
    public class RoleDto
    {
        public Guid Id { get; set; }

        public string Name { get; set; } = string.Empty;

        /// <summary>
        /// Permissions attached to this role (e.g. "Players.View", "Admin.ManageUsers").
        /// </summary>
        public List<string> Permissions { get; set; } = new();
    }
}
