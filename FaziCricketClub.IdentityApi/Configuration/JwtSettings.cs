namespace FaziCricketClub.IdentityApi.Configuration
{
    /// <summary>
    /// Strongly-typed settings for issuing and validating JWT tokens.
    /// Values are bound from configuration (appsettings.json -> "Jwt").
    /// 
    /// Having a dedicated configuration object:
    /// - Keeps Program.cs clean.
    /// - Makes it easy to validate and reason about JWT-related settings.
    /// </summary>
    public class JwtSettings
    {
        /// <summary>
        /// Issuer identifies the authority that created the token.
        /// Typically this is the URL or logical name of your Identity service.
        /// </summary>
        public string Issuer { get; set; } = string.Empty;

        /// <summary>
        /// Audience represents the intended recipients of the token.
        /// For APIs, this is usually your API resource identifier.
        /// </summary>
        public string Audience { get; set; } = string.Empty;

        /// <summary>
        /// Symmetric signing key used to sign the JWT.
        /// This should be a long, random secret and stored securely
        /// (e.g., user secrets in dev, KeyVault in prod).
        /// </summary>
        public string Key { get; set; } = string.Empty;

        /// <summary>
        /// Token lifetime in minutes. After this time, the token is no longer valid.
        /// Shorter lifetimes increase security but may impact UX.
        /// </summary>
        public int AccessTokenExpirationMinutes { get; set; } = 60;
    }
}
