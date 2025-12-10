namespace FaziCricketClub.API.Configuration
{
    /// <summary>
    /// JWT settings used by the CricketClub main API to validate access tokens.
    /// These values must match those used by CricketClub.IdentityApi to issue tokens
    /// (Issuer, Audience, and Key).
    /// </summary>
    public class JwtSettings
    {
        public string Issuer { get; set; } = string.Empty;

        public string Audience { get; set; } = string.Empty;

        public string Key { get; set; } = string.Empty;
    }
}
