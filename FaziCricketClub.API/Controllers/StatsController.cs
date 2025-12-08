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
        /// Returns fixture aggregation per season, including
        /// average fixtures per team in that season.
        /// </summary>
        [HttpGet("season-fixture-averages")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeasonFixtureAverageDto>>>> GetSeasonFixtureAveragesAsync(
            CancellationToken cancellationToken)
        {
            var stats = await _clubStatsService.GetSeasonFixtureAveragesAsync(cancellationToken);

            var response = ApiResponse<IEnumerable<SeasonFixtureAverageDto>>.Ok(
                stats,
                "Season fixture averages retrieved successfully.");

            return Ok(response);
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

        /// <summary>
        /// Returns fixture statistics grouped by season.
        /// </summary>
        [HttpGet("fixtures-by-season")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeasonFixtureStatsDto>>>> GetFixtureStatsBySeasonAsync(
            CancellationToken cancellationToken)
        {
            var stats = await _clubStatsService.GetSeasonFixtureStatsAsync(cancellationToken);

            var response = ApiResponse<IEnumerable<SeasonFixtureStatsDto>>.Ok(
                stats,
                "Fixture stats by season retrieved successfully.");

            return Ok(response);
        }

        /// <summary>
        /// Returns fixture statistics grouped by team.
        /// </summary>
        [HttpGet("fixtures-by-team")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<TeamFixtureStatsDto>>>> GetFixtureStatsByTeamAsync(
            CancellationToken cancellationToken)
        {
            var stats = await _clubStatsService.GetTeamFixtureStatsAsync(cancellationToken);

            var response = ApiResponse<IEnumerable<TeamFixtureStatsDto>>.Ok(
                stats,
                "Fixture stats by team retrieved successfully.");

            return Ok(response);
        }

        /// <summary>
        /// Returns fixture activity aggregated over time (by month),
        /// optionally filtered by season and/or team.
        /// </summary>
        [HttpGet("fixture-activity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<FixtureActivityPointDto>>>> GetFixtureActivityOverTimeAsync(
            [FromQuery] FixtureActivityFilterParameters filter,
            CancellationToken cancellationToken)
        {
            var points = await _clubStatsService.GetFixtureActivityOverTimeAsync(
                filter.From,
                filter.To,
                filter.SeasonId,
                filter.TeamId,
                cancellationToken);

            var response = ApiResponse<IEnumerable<FixtureActivityPointDto>>.Ok(
                points,
                "Fixture activity over time retrieved successfully.");

            return Ok(response);
        }

        /// <summary>
        /// Returns member sign-up activity aggregated over time (by month).
        /// </summary>
        [HttpGet("member-activity")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<MemberActivityPointDto>>>> GetMemberActivityOverTimeAsync(
            [FromQuery] MemberActivityFilterParameters filter,
            CancellationToken cancellationToken)
        {
            var points = await _clubStatsService.GetMemberActivityOverTimeAsync(
                filter.From,
                filter.To,
                filter.IsActive,
                cancellationToken);

            var response = ApiResponse<IEnumerable<MemberActivityPointDto>>.Ok(
                points,
                "Member activity over time retrieved successfully.");

            return Ok(response);
        }

    }
}
