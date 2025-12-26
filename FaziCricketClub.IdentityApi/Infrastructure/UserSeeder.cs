using FaziCricketClub.IdentityApi.Entities;
using Microsoft.AspNetCore.Identity;

namespace FaziCricketClub.IdentityApi.Infrastructure
{
    /// <summary>
    /// Seeds test users for development and testing purposes.
    ///
    /// Creates three test users (Admin, Captain, Player) with proper role assignments.
    /// This seeder is idempotent - it checks for existing users before creating them.
    /// </summary>
    public class UserSeeder
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly ILogger<UserSeeder> logger;

        public UserSeeder(
            UserManager<ApplicationUser> userManager,
            ILogger<UserSeeder> logger)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Seeds test users if they don't already exist.
        /// Creates: admin, captain, and player users with proper role assignments.
        /// </summary>
        public async Task SeedTestUsersAsync()
        {
            this.logger.LogInformation("Starting test user seeding.");

            // Define test users with their credentials and roles
            var testUsers = new[]
            {
                new
                {
                    UserName = "admin",
                    Email = "admin@fazcricket.com",
                    Password = "Admin@123",
                    Role = "Admin"
                },
                new
                {
                    UserName = "captain",
                    Email = "captain@fazcricket.com",
                    Password = "Captain@123",
                    Role = "Captain"
                },
                new
                {
                    UserName = "player",
                    Email = "player@fazcricket.com",
                    Password = "Player@123",
                    Role = "Player"
                }
            };

            foreach (var testUser in testUsers)
            {
                await this.EnsureUserExistsAsync(
                    testUser.UserName,
                    testUser.Email,
                    testUser.Password,
                    testUser.Role);
            }

            this.logger.LogInformation("Test user seeding completed.");
        }

        /// <summary>
        /// Creates a user if it doesn't already exist, and assigns the specified role.
        /// </summary>
        private async Task EnsureUserExistsAsync(
            string userName,
            string email,
            string password,
            string roleName)
        {
            // Check if user already exists by email
            var existingUser = await this.userManager.FindByEmailAsync(email);

            if (existingUser != null)
            {
                this.logger.LogInformation(
                    "User {Email} already exists. Skipping creation.",
                    email);
                return;
            }

            this.logger.LogInformation(
                "Creating test user: {UserName} ({Email}) with role {RoleName}.",
                userName, email, roleName);

            // Create new user
            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = userName,
                Email = email,
                EmailConfirmed = true // Pre-confirm for test users
            };

            var createResult = await this.userManager.CreateAsync(user, password);

            if (!createResult.Succeeded)
            {
                var errorDescriptions = string.Join("; ", createResult.Errors.Select(e => e.Description));
                this.logger.LogError(
                    "Failed to create user {UserName}: {Errors}",
                    userName, errorDescriptions);
                return;
            }

            this.logger.LogInformation(
                "Successfully created user {UserName}.",
                userName);

            // Assign role to user
            var roleResult = await this.userManager.AddToRoleAsync(user, roleName);

            if (!roleResult.Succeeded)
            {
                var errorDescriptions = string.Join("; ", roleResult.Errors.Select(e => e.Description));
                this.logger.LogWarning(
                    "User {UserName} created but failed to assign role {RoleName}: {Errors}",
                    userName, roleName, errorDescriptions);
            }
            else
            {
                this.logger.LogInformation(
                    "Successfully assigned role {RoleName} to user {UserName}.",
                    roleName, userName);
            }
        }
    }
}
