namespace FaziCricketClub.IdentityApi.Models.Admin
{
    /// <summary>
    /// Representation of a permission (ability) for admin UIs.
    /// </summary>
    public class PermissionDto
    {
        /// <summary>
        /// Unique permission value, e.g. "Players.View" or "Admin.ManageUsers".
        /// </summary>
        public string Value { get; set; } = string.Empty;

        /// <summary>
        /// Optional human-friendly description. For now we just echo the value,
        /// but this is a natural place to add richer metadata for UI display.
        /// </summary>
        public string Description { get; set; } = string.Empty;
    }
}
