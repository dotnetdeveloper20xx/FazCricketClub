using FaziCricketClub.API.Models;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// Manages fixtures (matches) in the CricketClub system.
    /// Thin controller delegating to the application layer.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class FixturesController : ControllerBase
    {
        private readonly IFixtureService _fixtureService;
        private readonly IMatchResultService _matchResultService;
        private readonly ILogger<FixturesController> _logger;

        public FixturesController(
            IFixtureService fixtureService,
            IMatchResultService matchResultService,
            ILogger<FixturesController> logger)
        {
            _fixtureService = fixtureService;
            _matchResultService = matchResultService;
            _logger = logger;
        }

        /// <summary>
        /// Deletes the match result and scorecards for the given fixture, if present.
        /// Does not delete the fixture itself.
        /// </summary>
        /// <param name="fixtureId">The ID of the fixture.</param>
        [HttpDelete("{fixtureId:int}/result")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public async Task<IActionResult> DeleteResultAsync(
            int fixtureId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Deleting match result for FixtureId={FixtureId}", fixtureId);

            await _matchResultService.DeleteMatchResultAsync(fixtureId, cancellationToken);

            return NoContent();
        }


        /// <summary>
        /// Creates or updates the match result and scorecards for a fixture.
        /// If a result already exists, it is replaced with the new data.
        /// Also marks the fixture as completed.
        /// </summary>
        /// <param name="fixtureId">The ID of the fixture.</param>
        /// <param name="request">Match result summary and scorecards.</param>
        [HttpPost("{fixtureId:int}/result")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<ApiResponse<MatchResultDetailDto>>> UpsertResultAsync(
            int fixtureId,
            [FromBody] MatchResultUpsertDto request,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Upserting match result for FixtureId={FixtureId}", fixtureId);

            if (!ModelState.IsValid)
            {
                var errors = ModelState
                    .Where(ms => ms.Value?.Errors.Count > 0)
                    .SelectMany(ms => ms.Value!.Errors.Select(e => new ApiError
                    {
                        Field = ms.Key,
                        Message = e.ErrorMessage
                    }))
                    .ToList();

                var errorResponse = ApiResponse<MatchResultDetailDto>.Fail(
                    "Match result payload is invalid.",
                    errors);

                return BadRequest(errorResponse);
            }

            var detail = await _matchResultService.UpsertMatchResultAsync(
                fixtureId,
                request,
                cancellationToken);

            var response = ApiResponse<MatchResultDetailDto>.Ok(
                detail,
                "Match result saved successfully.");

            return Ok(response);
        }


        /// <summary>
        /// Gets the recorded match result and scorecards for a fixture, if any.
        /// </summary>
        /// <param name="fixtureId">The ID of the fixture.</param>
        [HttpGet("{fixtureId:int}/result")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ApiResponse<MatchResultDetailDto>>> GetResultAsync(
            int fixtureId,
            CancellationToken cancellationToken)
        {
            _logger.LogInformation("Getting match result for FixtureId={FixtureId}", fixtureId);

            var detail = await _matchResultService.GetByFixtureIdAsync(fixtureId, cancellationToken);

            if (detail is null)
            {
                var notFoundResponse = ApiResponse<MatchResultDetailDto>.Fail(
                    $"No match result found for fixture {fixtureId}.");

                return NotFound(notFoundResponse);
            }

            var response = ApiResponse<MatchResultDetailDto>.Ok(
                detail,
                "Match result retrieved successfully.");

            return Ok(response);
        }


        /// <summary>
        /// Returns upcoming fixtures for the next number of days,
        /// optionally filtered by team.
        /// </summary>
        /// <param name="days">Number of days ahead to look (default 7).</param>
        /// <param name="teamId">Optional team id to filter by.</param>
        /// <param name="cancellationToken">Cancellation token.</param>
        [HttpGet("upcoming")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<IEnumerable<FixtureDto>>>> GetUpcomingAsync(
            [FromQuery] int days = 7,
            [FromQuery] int? teamId = null,
            CancellationToken cancellationToken = default)
        {
            if (days <= 0)
            {
                days = 7;
            }

            var fixtures = await _fixtureService.GetUpcomingAsync(days, teamId, cancellationToken);

            var response = ApiResponse<IEnumerable<FixtureDto>>.Ok(
                fixtures,
                $"Upcoming fixtures for the next {days} day(s).");

            return Ok(response);
        }

        /// <summary>
        /// Returns a paged, filterable, sortable list of fixtures.
        /// </summary>
        /// <param name="filter">
        /// Query parameters for paging, filtering and sorting:
        /// page, pageSize, seasonId, teamId, fromDate, toDate, sortBy, sortDirection.
        /// </param>
        /// <param name="cancellationToken">Cancellation token.</param>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<ApiResponse<PagedResult<FixtureDto>>>> GetPagedAsync(
            [FromQuery] FixtureFilterParameters filter,
            CancellationToken cancellationToken)
        {
            // Basic guard for silly values; service also normalises internally.
            if (filter.Page <= 0)
            {
                filter.Page = 1;
            }

            if (filter.PageSize <= 0)
            {
                filter.PageSize = 20;
            }

            var pagedResult = await _fixtureService.GetPagedAsync(filter, cancellationToken);

            var response = ApiResponse<PagedResult<FixtureDto>>.Ok(
                pagedResult,
                "Fixtures retrieved successfully.");

            return Ok(response);
        }

        /// <summary>
        /// Gets all fixtures.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<FixtureDto>>>> GetAllAsync(
            CancellationToken cancellationToken)
        {
            var fixtures = await _fixtureService.GetAllAsync(cancellationToken);
            var response = ApiResponse<IEnumerable<FixtureDto>>.Ok(fixtures);

            return Ok(response);
        }

        /// <summary>
        /// Gets a single fixture by its identifier.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<FixtureDto>>> GetByIdAsync(
            int id,
            CancellationToken cancellationToken)
        {
            var fixture = await _fixtureService.GetByIdAsync(id, cancellationToken);

            if (fixture == null)
            {
                return NotFound(Problem(
                    detail: $"Fixture with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Fixture not found"));
            }

            var response = ApiResponse<FixtureDto>.Ok(fixture);
            return Ok(response);
        }

        /// <summary>
        /// Creates a new fixture.
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<ApiResponse<FixtureDto>>> CreateAsync(
            [FromBody] CreateFixtureDto request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (request.HomeTeamId == request.AwayTeamId)
            {
                ModelState.AddModelError(nameof(request.AwayTeamId), "Home and away team cannot be the same.");
                return ValidationProblem(ModelState);
            }

            var created = await _fixtureService.CreateAsync(request, cancellationToken);

            var response = ApiResponse<FixtureDto>.Ok(created, "Fixture created successfully.");

            return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, response);
        }

        /// <summary>
        /// Updates an existing fixture.
        /// </summary>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(
            int id,
            [FromBody] UpdateFixtureDto request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            if (request.HomeTeamId == request.AwayTeamId)
            {
                ModelState.AddModelError(nameof(request.AwayTeamId), "Home and away team cannot be the same.");
                return ValidationProblem(ModelState);
            }

            var updated = await _fixtureService.UpdateAsync(id, request, cancellationToken);

            if (!updated)
            {
                return NotFound(Problem(
                    detail: $"Fixture with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Fixture not found"));
            }

            return NoContent();
        }

        /// <summary>
        /// Deletes an existing fixture (soft delete).
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var deleted = await _fixtureService.DeleteAsync(id, cancellationToken);

            if (!deleted)
            {
                return NotFound(Problem(
                    detail: $"Fixture with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Fixture not found"));
            }

            return NoContent();
        }
    }
}
