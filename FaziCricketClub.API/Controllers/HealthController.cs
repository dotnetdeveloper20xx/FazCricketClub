using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// Simple health check endpoint to verify that the API is running.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        /// <summary>
        /// Returns a basic health status payload for the API.
        /// </summary>
        /// <returns>An object indicating that the API is up.</returns>
        [HttpGet]
        public IActionResult Get()
        {
            var response = new
            {
                status = "OK",
                service = "CricketClub.WebApi",
                timestampUtc = DateTime.UtcNow
            };

            return Ok(response);
        }
    }
}
