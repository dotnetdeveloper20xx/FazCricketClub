using FaziCricketClub.API.Models;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StatsController : ControllerBase
    {
        private readonly IClubStatsService _clubStatsService;
        private readonly IPlayerStatsService _playerStatsService;
        private readonly ILogger<StatsController> _logger;

        public StatsController(
            IClubStatsService clubStatsService,
            IPlayerStatsService playerStatsService,
            ILogger<StatsController> logger)
        {
            _clubStatsService = clubStatsService;
            _playerStatsService = playerStatsService;
            _logger = logger;
        }

        /// <summary>
        /// Returns batting statistics for a player, optionally filtered by season.
        /// </summary>
        [HttpGet("player/{memberId:int}/batting")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<PlayerBattingStatsDto>>> GetPlayerBattingStatsAsync(
            int memberId,
            [FromQuery] int? seasonId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                "StatsController - GetPlayerBattingStatsAsync - MemberId={MemberId}, SeasonId={SeasonId}",
                memberId, seasonId);

            try
            {
                var stats = await _playerStatsService.GetBattingStatsAsync(
                    memberId,
                    seasonId,
                    cancellationToken);

                var response = ApiResponse<PlayerBattingStatsDto>.Ok(
                    stats,
                    "Player batting stats retrieved successfully.");

                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                var response = ApiResponse<PlayerBattingStatsDto>.Fail(ex.Message);
                return NotFound(response);
            }
        }


        /// <summary>
        /// Returns bowling statistics for a player, optionally filtered by season.
        /// </summary>
        [HttpGet("player/{memberId:int}/bowling")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<PlayerBowlingStatsDto>>> GetPlayerBowlingStatsAsync(
            int memberId,
            [FromQuery] int? seasonId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation(
                "StatsController - GetPlayerBowlingStatsAsync - MemberId={MemberId}, SeasonId={SeasonId}",
                memberId, seasonId);

            try
            {
                var stats = await _playerStatsService.GetBowlingStatsAsync(
                    memberId,
                    seasonId,
                    cancellationToken);

                var response = ApiResponse<PlayerBowlingStatsDto>.Ok(
                    stats,
                    "Player bowling stats retrieved successfully.");

                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                var response = ApiResponse<PlayerBowlingStatsDto>.Fail(ex.Message);
                return NotFound(response);
            }
        }

        /// <summary>
        /// Returns a batting leaderboard ordered by runs, then average, then strike rate.
        /// </summary>
        [HttpGet("leaderboard/batting")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<PlayerBattingLeaderboardEntryDto>>>> GetBattingLeaderboardAsync(
            [FromQuery] int? seasonId,
            [FromQuery] int topN = 10,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "StatsController - GetBattingLeaderboardAsync - SeasonId={SeasonId}, TopN={TopN}",
                seasonId, topN);

            var leaderboard = await _playerStatsService.GetBattingLeaderboardAsync(
                seasonId,
                topN,
                cancellationToken);

            var response = ApiResponse<IEnumerable<PlayerBattingLeaderboardEntryDto>>.Ok(
                leaderboard,
                "Batting leaderboard retrieved successfully.");

            return Ok(response);
        }

        /// <summary>
        /// Returns a bowling leaderboard ordered by wickets, then average, then economy.
        /// </summary>
        [HttpGet("leaderboard/bowling")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<PlayerBowlingLeaderboardEntryDto>>>> GetBowlingLeaderboardAsync(
            [FromQuery] int? seasonId,
            [FromQuery] int topN = 10,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "StatsController - GetBowlingLeaderboardAsync - SeasonId={SeasonId}, TopN={TopN}",
                seasonId, topN);

            var leaderboard = await _playerStatsService.GetBowlingLeaderboardAsync(
                seasonId,
                topN,
                cancellationToken);

            var response = ApiResponse<IEnumerable<PlayerBowlingLeaderboardEntryDto>>.Ok(
                leaderboard,
                "Bowling leaderboard retrieved successfully.");

            return Ok(response);
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
