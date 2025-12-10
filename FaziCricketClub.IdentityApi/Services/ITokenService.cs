using FaziCricketClub.IdentityApi.Entities;

namespace FaziCricketClub.IdentityApi.Services
{
    /// <summary>
    /// Abstraction for issuing JWT access tokens for authenticated users.
    /// 
    /// Keeping token issuance behind an interface:
    /// - Encapsulates JWT logic in one place.
    /// - Makes testing and future changes (e.g., adding refresh tokens) easier.
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Creates a signed JWT access token for the given user.
        /// </summary>
        /// <param name="user">The authenticated application user.</param>
        /// <returns>The signed JWT token string.</returns>
        Task<string> CreateTokenAsync(ApplicationUser user);
    }
}
