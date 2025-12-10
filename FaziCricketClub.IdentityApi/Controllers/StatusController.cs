using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.IdentityApi.Controllers
{
    /// <summary>
    /// Simple status controller to verify that the Identity API project
    /// is created, wired, and responding correctly.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class StatusController : ControllerBase
    {
        /// <summary>
        /// Returns basic information about the Identity API service.
        /// This is unsecured and intended only as a smoke test.
        /// </summary>
        /// <returns>Service name and environment details.</returns>
        [HttpGet]
        public IActionResult Get()
        {
            var response = new
            {
                Service = "CricketClub.IdentityApi",
                Description = "Skeleton for ASP.NET Core Identity demo (auth + authz).",
                Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown"
            };

            return Ok(response);
        }
    }
}
