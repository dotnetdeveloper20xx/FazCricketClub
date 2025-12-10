using FaziCricketClub.IdentityApi.Configuration;
using FaziCricketClub.IdentityApi.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FaziCricketClub.IdentityApi.Services
{
    /// <summary>
    /// Default implementation of <see cref="ITokenService"/> using JWT.
    /// 
    /// Responsibilities:
    /// - Build a set of claims for the user (sub, name, email, roles, permissions, etc.).
    /// - Sign the token using a symmetric secret from <see cref="JwtSettings"/>.
    /// - Respect token lifetime (AccessTokenExpirationMinutes).
    /// </summary>
    public class JwtTokenService : ITokenService
    {
        private readonly JwtSettings jwtSettings;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<ApplicationRole> roleManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="JwtTokenService"/> class.
        /// </summary>
        /// <param name="jwtOptions">JWT configuration options.</param>
        /// <param name="userManager">User manager to fetch user details and roles.</param>
        /// <param name="roleManager">Role manager to fetch role claims (permissions).</param>
        public JwtTokenService(
            IOptions<JwtSettings> jwtOptions,
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager)
        {
            this.jwtSettings = jwtOptions.Value ?? throw new ArgumentNullException(nameof(jwtOptions));
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));

            if (string.IsNullOrWhiteSpace(this.jwtSettings.Key))
            {
                throw new InvalidOperationException("JWT signing key is not configured.");
            }
        }

        /// <inheritdoc />
        public async Task<string> CreateTokenAsync(ApplicationUser user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            // Build standard, role, and permission claims for the JWT.
            var claims = await this.BuildClaimsAsync(user);

            // Create the signing key from the configured secret.
            var keyBytes = Encoding.UTF8.GetBytes(this.jwtSettings.Key);
            var signingKey = new SymmetricSecurityKey(keyBytes);

            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            // Define token parameters.
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(this.jwtSettings.AccessTokenExpirationMinutes),
                Issuer = this.jwtSettings.Issuer,
                Audience = this.jwtSettings.Audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);

            // Return the serialized JWT string.
            return tokenHandler.WriteToken(securityToken);
        }

        /// <summary>
        /// Builds the list of claims that will be embedded in the JWT token.
        /// Includes:
        /// - Subject identifier (sub)
        /// - Name identifier, name, email
        /// - JTI (unique token ID) for traceability
        /// - Role claims (for [Authorize(Roles = "...")])
        /// - Permission claims (for fine-grained UI/backend control)
        /// </summary>
        /// <param name="user">The application user.</param>
        /// <returns>A list of claims.</returns>
        private async Task<IList<Claim>> BuildClaimsAsync(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                // Subject identifier (standard JWT claim)
                new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),

                // Unique token identifier, useful for logging / revocation strategies
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),

                // User identity claims
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new(ClaimTypes.Name, user.UserName ?? string.Empty),
                new(ClaimTypes.Email, user.Email ?? string.Empty)
            };

            // Attach user roles as separate claims.
            var roles = await this.userManager.GetRolesAsync(user);

            foreach (var roleName in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, roleName));

                // For each role, also bring over its permission claims.
                var role = await this.roleManager.FindByNameAsync(roleName);
                if (role == null)
                {
                    continue;
                }

                var roleClaims = await this.roleManager.GetClaimsAsync(role);

                // We only care about permission-type claims here.
                foreach (var rc in roleClaims)
                {
                    if (rc.Type.Equals("permission", StringComparison.OrdinalIgnoreCase))
                    {
                        // Avoid duplicates: only add if not already present.
                        if (!claims.Exists(c => c.Type == rc.Type && c.Value == rc.Value))
                        {
                            claims.Add(new Claim(rc.Type, rc.Value));
                        }
                    }
                }
            }

            return claims;
        }
    }
}
