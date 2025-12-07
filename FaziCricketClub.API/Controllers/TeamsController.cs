using FaziCricketClub.API.Models;
using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// Manages teams in the CricketClub system.
    /// Thin controller that delegates to the application layer.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class TeamsController : ControllerBase
    {
        private readonly ITeamService _teamService;

        public TeamsController(ITeamService teamService)
        {
            _teamService = teamService;
        }

        /// <summary>
        /// Gets all teams.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IEnumerable<TeamDto>>>> GetAllAsync(CancellationToken cancellationToken)
        {
            var teams = await _teamService.GetAllAsync(cancellationToken);
            var response = ApiResponse<IEnumerable<TeamDto>>.Ok(teams);

            return Ok(response);
        }

        /// <summary>
        /// Gets a single team by its identifier.
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ApiResponse<TeamDto>>> GetByIdAsync(int id, CancellationToken cancellationToken)
        {
            var team = await _teamService.GetByIdAsync(id, cancellationToken);

            if (team == null)
            {
                return NotFound(Problem(
                    detail: $"Team with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Team not found"));
            }

            var response = ApiResponse<TeamDto>.Ok(team);
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TeamDto>>> CreateAsync(
      [FromBody] CreateTeamDto request,
      CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var created = await _teamService.CreateAsync(request, cancellationToken);
            var response = ApiResponse<TeamDto>.Ok(created, "Team created successfully.");

            return CreatedAtAction(nameof(GetByIdAsync), new { id = created.Id }, response);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(
            int id,
            [FromBody] UpdateTeamDto request,
            CancellationToken cancellationToken)
        {
            if (!ModelState.IsValid)
            {
                return ValidationProblem(ModelState);
            }

            var updated = await _teamService.UpdateAsync(id, request, cancellationToken);

            if (!updated)
            {
                return NotFound(Problem(
                    detail: $"Team with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Team not found"));
            }

            return NoContent();
        }


        /// <summary>
        /// Deletes an existing team.
        /// </summary>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id, CancellationToken cancellationToken)
        {
            var deleted = await _teamService.DeleteAsync(id, cancellationToken);

            if (!deleted)
            {
                return NotFound(Problem(
                    detail: $"Team with id {id} was not found.",
                    statusCode: StatusCodes.Status404NotFound,
                    title: "Team not found"));
            }

            return NoContent();
        }
    }
}
