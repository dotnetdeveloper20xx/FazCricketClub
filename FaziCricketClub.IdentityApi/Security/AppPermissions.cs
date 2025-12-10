namespace FaziCricketClub.IdentityApi.Security
{
    /// <summary>
    /// Central catalog of application permissions (abilities).
    /// 
    /// The recommended pattern is:
    ///   - Group permissions by feature (Players, Teams, Fixtures, Admin, etc.).
    ///   - Use dot-separated names so they are easy to parse and reason about.
    /// 
    /// These string values will:
    ///   - Be stored as role claims of type "permission".
    ///   - Be emitted into JWT tokens for authenticated users.
    ///   - Be used by the front-end to enable/disable UI actions.
    ///   - Be used by policy-based authorization on the backend.
    /// </summary>
    public static class AppPermissions
    {
        public const string Players_View = "Players.View";
        public const string Players_Edit = "Players.Edit";

        public const string Teams_View = "Teams.View";
        public const string Teams_Edit = "Teams.Edit";

        public const string Fixtures_View = "Fixtures.View";
        public const string Fixtures_Edit = "Fixtures.Edit";

        // Admin / security-related permissions.
        public const string Admin_ManageUsers = "Admin.ManageUsers";
        public const string Admin_ManageRoles = "Admin.ManageRoles";
        public const string Admin_ManagePermissions = "Admin.ManagePermissions";

        /// <summary>
        /// Returns all defined permissions as an array.
        /// Useful for seeding, validation, or exposing a catalog for admin UIs.
        /// </summary>
        public static string[] All =>
        [
            Players_View,
            Players_Edit,
            Teams_View,
            Teams_Edit,
            Fixtures_View,
            Fixtures_Edit,
            Admin_ManageUsers,
            Admin_ManageRoles,
            Admin_ManagePermissions
        ];
    }
}
