using Microsoft.AspNetCore.Identity;

namespace FaziCricketClub.IdentityApi.Entities
{
    /// <summary>
    /// Domain representation of an application user for the Identity system.
    /// Inherits from IdentityUser{Guid} to:
    /// - Use a GUID as the primary key (recommended in many enterprise systems).
    /// - Gain all the standard Identity properties (UserName, Email, etc.).
    /// 
    /// This class is the right place to add any custom user properties in future,
    /// for example:
    ///   - DisplayName
    ///   - Cricket-specific metadata (e.g., PlayerNumber)
    ///   - Audit fields
    /// </summary>
    public class ApplicationUser : IdentityUser<Guid>
    {
        // Example of a custom property for future use:
        //
        // public string? DisplayName { get; set; }
        //
        // For now we keep it minimal to focus on Identity setup.
    }
}
