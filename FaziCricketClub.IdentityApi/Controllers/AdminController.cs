using FaziCricketClub.IdentityApi.Entities;
using FaziCricketClub.IdentityApi.Models.Admin;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FaziCricketClub.IdentityApi.Controllers
{
    /// <summary>
    /// Administrative endpoints for managing users, roles, and permissions.
    /// 
    /// In this first step, the controller is read-only:
    /// - Get all roles and their permissions.
    /// - Get all users and their roles.
    /// 
    /// Mutating endpoints (create/update/delete roles/users, adjust permissions)
    /// will be introduced in later steps.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Require authentication by default; individual actions refine via policies.
    public class AdminController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly RoleManager<ApplicationRole> roleManager;
        private readonly ILogger<AdminController> logger;

        public AdminController(
            UserManager<ApplicationUser> userManager,
            RoleManager<ApplicationRole> roleManager,
            ILogger<AdminController> logger)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.roleManager = roleManager ?? throw new ArgumentNullException(nameof(roleManager));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Returns all roles with their associated permissions.
        /// Requires the CanManageRoles policy (Admin.ManageRoles permission).
        /// </summary>
        /// <returns>List of roles and their permissions.</returns>
        [HttpGet("roles")]
        [Authorize(Policy = "CanManageRoles")]
        [ProducesResponseType(typeof(IEnumerable<RoleDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetRolesAsync()
        {
            this.logger.LogInformation("Admin {Admin} requested list of roles.", this.User.Identity?.Name);

            var roles = this.roleManager.Roles.ToList();
            var result = new List<RoleDto>();

            foreach (var role in roles)
            {
                var claims = await this.roleManager.GetClaimsAsync(role);

                var permissions = claims
                    .Where(c => c.Type.Equals("permission", StringComparison.OrdinalIgnoreCase))
                    .Select(c => c.Value)
                    .OrderBy(v => v)
                    .ToList();

                result.Add(new RoleDto
                {
                    Id = role.Id,
                    Name = role.Name ?? string.Empty,
                    Permissions = permissions
                });
            }

            return this.Ok(result);
        }

        /// <summary>
        /// Returns all users with their roles.
        /// Requires the CanManageUsers policy (Admin.ManageUsers permission).
        /// 
        /// NOTE:
        /// - This is a simple demo implementation that loads all users.
        /// - In a real system, you would add paging/filtering to handle large user counts.
        /// </summary>
        /// <returns>List of users with their roles.</returns>
        [HttpGet("users")]
        [Authorize(Policy = "CanManageUsers")]
        [ProducesResponseType(typeof(IEnumerable<UserDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetUsersAsync()
        {
            this.logger.LogInformation("Admin {Admin} requested list of users.", this.User.Identity?.Name);

            // For demo purposes, we enumerate all users.
            // In a real system, add paging and criteria (search by email, role, etc.).
            var users = this.userManager.Users.ToList();
            var result = new List<UserDto>();

            foreach (var user in users)
            {
                var roles = await this.userManager.GetRolesAsync(user);

                var dto = new UserDto
                {
                    Id = user.Id,
                    UserName = user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    IsLockedOut = user.LockoutEnd.HasValue && user.LockoutEnd.Value.UtcDateTime > DateTime.UtcNow,
                    Roles = roles.OrderBy(r => r).ToList()
                };

                result.Add(dto);
            }

            return this.Ok(result);
        }

        /// <summary>
        /// Returns the current admin's own identity information, including roles and permissions,
        /// as a quick check that the admin policies/permissions are working as expected.
        /// </summary>
        /// <returns>Admin identity snapshot.</returns>
        [HttpGet("me")]
        [Authorize(Policy = "CanManageUsers")] // or a dedicated admin permission if preferred
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public IActionResult Me()
        {
            var userId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = this.User.Identity?.Name;
            var email = this.User.FindFirstValue(ClaimTypes.Email);
            var roles = this.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToArray();
            var permissions = this.User.FindAll("permission").Select(p => p.Value).ToArray();

            var response = new
            {
                UserId = userId,
                UserName = userName,
                Email = email,
                Roles = roles,
                Permissions = permissions
            };

            return this.Ok(response);
        }

        /// <summary>
        /// Assigns a role to a user.
        /// Requires both:
        /// - CanManageUsers (you are allowed to manage users), and
        /// - CanManageRoles (you are allowed to manipulate role assignments).
        /// </summary>
        /// <param name="userId">User Id (GUID) to modify.</param>
        /// <param name="request">Role assignment payload.</param>
        /// <returns>NoContent on success, or an error result.</returns>
        [HttpPost("users/{userId:guid}/roles")]
        [Authorize(Policy = "CanManageUsers")]
        [Authorize(Policy = "CanManageRoles")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> AssignRoleToUserAsync(Guid userId, [FromBody] AssignRoleRequest request)
        {
            if (!this.ModelState.IsValid)
            {
                return this.ValidationProblem(this.ModelState);
            }

            this.logger.LogInformation(
                "Admin {Admin} assigning role {Role} to user {UserId}.",
                this.User.Identity?.Name, request.RoleName, userId);

            var user = await this.userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return this.NotFound($"User with id '{userId}' was not found.");
            }

            var role = await this.roleManager.FindByNameAsync(request.RoleName);
            if (role == null)
            {
                return this.BadRequest($"Role '{request.RoleName}' does not exist.");
            }

            var userRoles = await this.userManager.GetRolesAsync(user);
            if (userRoles.Contains(request.RoleName))
            {
                // No-op if already in role.
                return this.NoContent();
            }

            var result = await this.userManager.AddToRoleAsync(user, request.RoleName);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                this.logger.LogWarning(
                    "Failed to assign role {Role} to user {UserId}: {Errors}",
                    request.RoleName, userId, errors);

                return this.BadRequest(new { message = "Failed to assign role.", errors });
            }

            return this.NoContent();
        }

        /// <summary>
        /// Removes a role from a user.
        /// Requires both CanManageUsers and CanManageRoles.
        /// </summary>
        /// <param name="userId">User Id (GUID) to modify.</param>
        /// <param name="roleName">Role name to remove.</param>
        /// <returns>NoContent on success, or an error result.</returns>
        [HttpDelete("users/{userId:guid}/roles/{roleName}")]
        [Authorize(Policy = "CanManageUsers")]
        [Authorize(Policy = "CanManageRoles")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> RemoveRoleFromUserAsync(Guid userId, string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                return this.BadRequest("Role name must be provided.");
            }

            this.logger.LogInformation(
                "Admin {Admin} removing role {Role} from user {UserId}.",
                this.User.Identity?.Name, roleName, userId);

            var user = await this.userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return this.NotFound($"User with id '{userId}' was not found.");
            }

            var role = await this.roleManager.FindByNameAsync(roleName);
            if (role == null)
            {
                return this.BadRequest($"Role '{roleName}' does not exist.");
            }

            var userRoles = await this.userManager.GetRolesAsync(user);
            if (!userRoles.Contains(roleName))
            {
                // No-op if the user does not have that role.
                return this.NoContent();
            }

            var result = await this.userManager.RemoveFromRoleAsync(user, roleName);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                this.logger.LogWarning(
                    "Failed to remove role {Role} from user {UserId}: {Errors}",
                    roleName, userId, errors);

                return this.BadRequest(new { message = "Failed to remove role.", errors });
            }

            return this.NoContent();
        }

        /// <summary>
        /// Locks a user account for a given duration (default 15 minutes if not specified).
        /// Requires CanManageUsers permission.
        /// </summary>
        /// <param name="userId">User Id (GUID) to lock.</param>
        /// <param name="request">Lockout settings.</param>
        /// <returns>NoContent on success, or an error result.</returns>
        [HttpPost("users/{userId:guid}/lock")]
        [Authorize(Policy = "CanManageUsers")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> LockUserAsync(Guid userId, [FromBody] LockUserRequest request)
        {
            if (!this.ModelState.IsValid)
            {
                return this.ValidationProblem(this.ModelState);
            }

            var minutes = request.Minutes ?? 15;
            if (minutes <= 0)
            {
                minutes = 15;
            }

            this.logger.LogInformation(
                "Admin {Admin} locking user {UserId} for {Minutes} minutes.",
                this.User.Identity?.Name, userId, minutes);

            var user = await this.userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return this.NotFound($"User with id '{userId}' was not found.");
            }

            var lockoutEnd = DateTimeOffset.UtcNow.AddMinutes(minutes);
            var result = await this.userManager.SetLockoutEndDateAsync(user, lockoutEnd);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                this.logger.LogWarning(
                    "Failed to lock user {UserId}: {Errors}",
                    userId, errors);

                return this.BadRequest(new { message = "Failed to lock user.", errors });
            }

            return this.NoContent();
        }

        /// <summary>
        /// Unlocks a user account immediately.
        /// Requires CanManageUsers permission.
        /// </summary>
        /// <param name="userId">User Id (GUID) to unlock.</param>
        /// <returns>NoContent on success, or an error result.</returns>
        [HttpPost("users/{userId:guid}/unlock")]
        [Authorize(Policy = "CanManageUsers")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> UnlockUserAsync(Guid userId)
        {
            this.logger.LogInformation(
                "Admin {Admin} unlocking user {UserId}.",
                this.User.Identity?.Name, userId);

            var user = await this.userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return this.NotFound($"User with id '{userId}' was not found.");
            }

            // Reset lockout end to now, effectively unlocking the user.
            var result = await this.userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow);

            if (!result.Succeeded)
            {
                var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                this.logger.LogWarning(
                    "Failed to unlock user {UserId}: {Errors}",
                    userId, errors);

                return this.BadRequest(new { message = "Failed to unlock user.", errors });
            }

            // Optionally reset access failed count.
            await this.userManager.ResetAccessFailedCountAsync(user);

            return this.NoContent();
        }

    }
}
