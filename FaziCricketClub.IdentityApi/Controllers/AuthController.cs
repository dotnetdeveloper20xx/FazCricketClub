using FaziCricketClub.IdentityApi.Entities;
using FaziCricketClub.IdentityApi.Models;
using FaziCricketClub.IdentityApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FaziCricketClub.IdentityApi.Controllers
{
    /// <summary>
    /// Authentication and registration endpoints for the Identity API.
    /// 
    /// Responsibilities:
    /// - Register new users (with optional role assignment).
    /// - Authenticate existing users and issue JWT tokens.
    /// - Provide a simple "me" endpoint to inspect current user identity.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> userManager;
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly ITokenService tokenService;
        private readonly ILogger<AuthController> logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            ITokenService tokenService,
            ILogger<AuthController> logger)
        {
            this.userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
            this.signInManager = signInManager ?? throw new ArgumentNullException(nameof(signInManager));
            this.tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Registers a new user account and returns a JWT token upon success.
        /// </summary>
        /// <param name="request">Registration details.</param>
        /// <returns>An <see cref="AuthResponse"/> with the issued token.</returns>
        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!this.ModelState.IsValid)
            {
                return this.ValidationProblem(this.ModelState);
            }

            this.logger.LogInformation("Registering new user with email {Email}.", request.Email);

            var existingUser = await this.userManager.FindByEmailAsync(request.Email);
            if (existingUser != null)
            {
                // Do not leak which field caused the issue in real systems;
                // here we keep it simple but still generic.
                return this.BadRequest("A user with this email already exists.");
            }

            var userName = string.IsNullOrWhiteSpace(request.UserName)
                ? request.Email
                : request.UserName;

            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                UserName = userName,
                Email = request.Email,
                EmailConfirmed = false // For demo. In real systems you should confirm via email.
            };

            var createResult = await this.userManager.CreateAsync(user, request.Password);

            if (!createResult.Succeeded)
            {
                var errors = createResult.Errors.Select(e => e.Description);
                var errorMessage = string.Join("; ", errors);
                this.logger.LogWarning("User registration failed for {Email}: {Errors}", request.Email, errorMessage);

                return this.BadRequest(new { message = "User registration failed.", errors });
            }

            // Optional role assignment.
            if (!string.IsNullOrWhiteSpace(request.Role))
            {
                var roleResult = await this.userManager.AddToRoleAsync(user, request.Role);

                if (!roleResult.Succeeded)
                {
                    this.logger.LogWarning("Failed to assign role {Role} to user {Email}.", request.Role, request.Email);
                    // We don't fail registration; the user exists but without the requested role.
                }
            }

            // Issue JWT token for the newly registered user.
            var token = await this.tokenService.CreateTokenAsync(user);

            var response = new AuthResponse
            {
                AccessToken = token,
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(60), // Keep in sync with JwtSettings.
                UserId = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty
            };

            return this.Ok(response);
        }

        /// <summary>
        /// Authenticates an existing user and returns a JWT token upon success.
        /// </summary>
        /// <param name="request">Login credentials.</param>
        /// <returns>An <see cref="AuthResponse"/> with the issued token.</returns>
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!this.ModelState.IsValid)
            {
                return this.ValidationProblem(this.ModelState);
            }

            this.logger.LogInformation("Login attempt for user {Email}.", request.Email);

            var user = await this.userManager.FindByEmailAsync(request.Email);

            if (user == null)
            {
                // Do not reveal whether the email exists.
                return this.Unauthorized("Invalid credentials.");
            }

            var signInResult = await this.signInManager.CheckPasswordSignInAsync(
                user,
                request.Password,
                lockoutOnFailure: true);

            if (!signInResult.Succeeded)
            {
                if (signInResult.IsLockedOut)
                {
                    this.logger.LogWarning("User {Email} is locked out.", request.Email);
                    return this.Unauthorized("Account is locked. Please try again later.");
                }

                return this.Unauthorized("Invalid credentials.");
            }

            // Issue JWT token for the authenticated user.
            var token = await this.tokenService.CreateTokenAsync(user);

            var response = new AuthResponse
            {
                AccessToken = token,
                ExpiresAtUtc = DateTime.UtcNow.AddMinutes(60), // Keep in sync with JwtSettings.
                UserId = user.Id,
                UserName = user.UserName ?? string.Empty,
                Email = user.Email ?? string.Empty
            };

            return this.Ok(response);
        }

        /// <summary>
        /// Returns basic information about the currently authenticated user,
        /// including roles and permissions extracted from the JWT.
        /// Useful for testing that JWT authentication and authorization work,
        /// and for the frontend to drive UI behavior.
        /// </summary>
        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public IActionResult Me()
        {
            var userId = this.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = this.User.Identity?.Name;
            var email = this.User.FindFirstValue(ClaimTypes.Email);
            var roles = this.User.FindAll(ClaimTypes.Role).Select(r => r.Value).ToArray();

            // Permissions are represented as claims of type "permission" in our JWT.
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
