using FaziCricketClub.API.Models;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// Manages seasons in the CricketClub system.
    /// This controller is intentionally thin and delegates to the application layer.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SeasonsController : ControllerBase
    {
        private readonly ISeasonService _seasonService;

        public SeasonsController(ISeasonService seasonService)
        {
            _seasonService = seasonService;
        }

        /// <summary>
        /// Gets all seasons.
        /// </summary>
        [HttpGet]
        [Authorize(Policy = "CanViewFixtures")]
        public async Task<ActionResult<ApiResponse<IEnumerable<SeasonDto>>>> GetAllAsync(CancellationToken cancellationToken)
        {
            var seasons = await _seasonService.GetAllAsync(cancellationToken);

            var response = ApiResponse<IEnumerable<SeasonDto>>.Ok(seasons);
            return Ok(response);
        }

        /// <summary>
        /// Gets a single season by its identifier.
        /// </summary>
        [HttpGet("{id:int}")]
        [Authorize(Policy = "CanViewFixtures")]
        public async Task<ActionResult<ApiResponse<SeasonDto>>> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var season = await _seasonService.GetByIdAsync(id, cancellationToken);

            if (season == null)
            {
                // Use ProblemDetails for 404.
                return NotFound(Problem(
                    detail: $"Season with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Season not found"));
            }

            var response = ApiResponse<SeasonDto>.Ok(season);
            return Ok(response);
        }

        [HttpPost]
        [Authorize(Policy = "CanEditFixtures")]
        public async Task<ActionResult<ApiResponse<SeasonDto>>> CreateAsync(
     [FromBody] CreateSeasonDto request,
     CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var created = await _seasonService.CreateAsync(request, cancellationToken);

            var response = ApiResponse<SeasonDto>.Ok(created, "Season created successfully.");

            return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, response);
        }

        [HttpPut("{id:int}")]
        [Authorize(Policy = "CanEditFixtures")]
        public async Task<IActionResult> UpdateAsync(
            int id,
            [FromBody] UpdateSeasonDto request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var updated = await _seasonService.UpdateAsync(id, request, cancellationToken);

            if (!updated)
            {
                return NotFound(Problem(
                    detail: $"Season with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Season not found"));
            }

            return NoContent();
        }


        /// <summary>
        /// Deletes an existing season.
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Policy = "CanEditFixtures")]
        public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var deleted = await _seasonService.DeleteAsync(id, cancellationToken);

            if (!deleted)
            {
                return NotFound(Problem(
                    detail: $"Season with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Season not found"));
            }

            return NoContent();
        }
    }
}
