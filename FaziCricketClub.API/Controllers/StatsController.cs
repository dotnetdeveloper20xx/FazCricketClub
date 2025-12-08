using FaziCricketClub.API.Models;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StatsController : ControllerBase
    {
        private readonly IClubStatsService _clubStatsService;

        public StatsController(IClubStatsService clubStatsService)
        {
            _clubStatsService = clubStatsService;
        }

        /// <summary>
        /// Returns club-wide statistics for dashboard use.
        /// </summary>
        [HttpGet("club")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<ClubStatsDto>>> GetClubStatsAsync(
            CancellationToken cancellationToken)
        {
            var stats = await _clubStatsService.GetClubStatsAsync(cancellationToken);

            var response = ApiResponse<ClubStatsDto>.Ok(
                stats,
                "Club stats retrieved successfully.");

            return Ok(response);
        }
    }
}
