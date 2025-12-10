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
    }
}
