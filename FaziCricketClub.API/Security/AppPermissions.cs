namespace FaziCricketClub.API.Security
{
    /// <summary>
    /// Copy of the central permission catalog used by the Identity API.
    /// For now we duplicate it; later we can factor this into a shared library.
    /// 
    /// These values MUST match the ones you use in CricketClub.IdentityApi.Security.AppPermissions.
    /// </summary>
    public static class AppPermissions
    {
        public const string Players_View = "Players.View";
        public const string Players_Edit = "Players.Edit";

        public const string Teams_View = "Teams.View";
        public const string Teams_Edit = "Teams.Edit";

        public const string Fixtures_View = "Fixtures.View";
        public const string Fixtures_Edit = "Fixtures.Edit";

        // Admin / security permissions (main API may or may not need these).
        public const string Admin_ManageUsers = "Admin.ManageUsers";
        public const string Admin_ManageRoles = "Admin.ManageRoles";
        public const string Admin_ManagePermissions = "Admin.ManagePermissions";
    }
}
