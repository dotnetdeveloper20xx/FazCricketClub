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

        public FixturesController(IFixtureService fixtureService)
        {
            _fixtureService = fixtureService;
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
