using Microsoft.AspNetCore.Identity;

namespace FaziCricketClub.IdentityApi.Entities
{
    /// <summary>
    /// Domain representation of an application role.
    /// Inherits from IdentityRole{Guid} to:
    /// - Use a GUID as the primary key for roles.
    /// - Gain standard role properties (Name, NormalizedName, etc.).
    /// 
    /// You can add custom metadata here for roles if needed,
    /// such as role descriptions or audit fields.
    /// </summary>
    public class ApplicationRole : IdentityRole<Guid>
    {
        // Example custom property for future use:
        //
        // public string? Description { get; set; }
    }
}
