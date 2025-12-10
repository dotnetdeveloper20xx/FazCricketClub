using FaziCricketClub.IdentityApi.Entities;
using FaziCricketClub.IdentityApi.Security;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace FaziCricketClub.IdentityApi.Infrastructure
{
    /// <summary>
    /// Seeds initial roles and their associated permissions.
    /// 
    /// This is a simple, code-based seeder that:
    /// - Creates roles if they do not exist.
    /// - Assigns permission claims to each role.
    /// 
    /// In a real system, you might move this to a dedicated migration or admin UI,
    /// but for our demo/learning environment, a code-based seeder is pragmatic.
    /// </summary>
    public class IdentityDataSeeder
    {
        private readonly RoleManager<ApplicationRole> roleManager;
        private readonly ILogger<IdentityDataSeeder> logger;

        public IdentityDataSeeder(
            RoleManager<ApplicationRole> roleManager,
            ILogger<IdentityDataSeeder> logger)
        {
            this.roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Ensures that roles and their permissions are created.
        /// Call this once at application startup.
        /// </summary>
        public async Task SeedAsync()
        {
            this.logger.LogInformation("Starting Identity data seeding (roles + permissions).");

            // Define role -> permissions mapping here.
            var rolePermissions = new Dictionary<string, string[]>
            {
                {
                    "Admin",
                    new[]
                    {
                        AppPermissions.Players_View,
                        AppPermissions.Players_Edit,
                        AppPermissions.Teams_View,
                        AppPermissions.Teams_Edit,
                        AppPermissions.Fixtures_View,
                        AppPermissions.Fixtures_Edit,
                        AppPermissions.Admin_ManageUsers,
                        AppPermissions.Admin_ManageRoles,
                        AppPermissions.Admin_ManagePermissions
                    }
                },
                {
                    "Captain",
                    new[]
                    {
                        AppPermissions.Players_View,
                        AppPermissions.Players_Edit,
                        AppPermissions.Teams_View,
                        AppPermissions.Teams_Edit,
                        AppPermissions.Fixtures_View,
                        AppPermissions.Fixtures_Edit
                    }
                },
                {
                    "Player",
                    new[]
                    {
                        AppPermissions.Players_View,
                        AppPermissions.Teams_View,
                        AppPermissions.Fixtures_View
                    }
                }
            };

            foreach (var (roleName, permissions) in rolePermissions)
            {
                await this.EnsureRoleWithPermissionsAsync(roleName, permissions);
            }

            this.logger.LogInformation("Identity data seeding completed.");
        }

        private async Task EnsureRoleWithPermissionsAsync(string roleName, string[] permissions)
        {
            var role = await this.roleManager.FindByNameAsync(roleName);

            if (role == null)
            {
                this.logger.LogInformation("Creating role {RoleName}.", roleName);

                role = new ApplicationRole
                {
                    Id = Guid.NewGuid(),
                    Name = roleName,
                    NormalizedName = roleName.ToUpperInvariant()
                };

                var result = await this.roleManager.CreateAsync(role);

                if (!result.Succeeded)
                {
                    var errorDescriptions = string.Join("; ", result.Errors.Select(e => e.Description));
                    this.logger.LogError("Failed to create role {RoleName}: {Errors}", roleName, errorDescriptions);
                    return;
                }
            }

            // Get existing claims for this role.
            var existingClaims = await this.roleManager.GetClaimsAsync(role);
            var existingPermissions = existingClaims
                .Where(c => c.Type.Equals("permission", StringComparison.OrdinalIgnoreCase))
                .Select(c => c.Value)
                .ToHashSet(StringComparer.OrdinalIgnoreCase);

            foreach (var permission in permissions)
            {
                if (!existingPermissions.Contains(permission))
                {
                    this.logger.LogInformation(
                        "Adding permission {Permission} to role {RoleName}.",
                        permission, roleName);

                    var claim = new Claim("permission", permission);
                    var claimResult = await this.roleManager.AddClaimAsync(role, claim);

                    if (!claimResult.Succeeded)
                    {
                        var errorDescriptions = string.Join("; ", claimResult.Errors.Select(e => e.Description));
                        this.logger.LogError(
                            "Failed to add permission {Permission} to role {RoleName}: {Errors}",
                            permission, roleName, errorDescriptions);
                    }
                }
            }
        }
    }
}

