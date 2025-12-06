using FaziCricketClub.API.Models;
using FaziCricketClub.Domain.Entities;
using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// Manages seasons in the CricketClub system.
    /// This is our first "real" CRUD controller backed by EF Core and SQL.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SeasonsController : ControllerBase
    {
        private readonly CricketClubDbContext _dbContext;

        /// <summary>
        /// Initializes a new instance of the <see cref="SeasonsController"/> class.
        /// </summary>
        /// <param name="dbContext">The EF Core DbContext for CricketClub.</param>
        public SeasonsController(CricketClubDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Gets all seasons.
        /// </summary>
        /// <returns>A list of seasons.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SeasonDto>>> GetAllAsync()
        {
            var seasons = await _dbContext.Seasons
                .OrderBy(s => s.StartDate)
                .Select(s => new SeasonDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate
                })
                .ToListAsync();

            return Ok(seasons);
        }

        /// <summary>
        /// Gets a single season by its identifier.
        /// </summary>
        /// <param name="id">The season identifier.</param>
        /// <returns>The requested season, if found.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SeasonDto>> GetByIdAsync(int id)
        {
            var season = await _dbContext.Seasons
                .Where(s => s.Id == id)
                .Select(s => new SeasonDto
                {
                    Id = s.Id,
                    Name = s.Name,
                    Description = s.Description,
                    StartDate = s.StartDate,
                    EndDate = s.EndDate
                })
                .SingleOrDefaultAsync();

            if (season == null)
            {
                return NotFound();
            }

            return Ok(season);
        }

        /// <summary>
        /// Creates a new season.
        /// </summary>
        /// <param name="request">The season details to create.</param>
        /// <returns>The created season.</returns>
        [HttpPost]
        public async Task<ActionResult<SeasonDto>> CreateAsync([FromBody] CreateSeasonDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Basic validation: start date should be before end date.
            if (request.StartDate > request.EndDate)
            {
                ModelState.AddModelError(nameof(request.EndDate), "End date must be after start date.");
                return BadRequest(ModelState);
            }

            var season = new Season
            {
                Name = request.Name,
                Description = request.Description,
                StartDate = request.StartDate,
                EndDate = request.EndDate
            };

            _dbContext.Seasons.Add(season);
            await _dbContext.SaveChangesAsync();

            var result = new SeasonDto
            {
                Id = season.Id,
                Name = season.Name,
                Description = season.Description,
                StartDate = season.StartDate,
                EndDate = season.EndDate
            };

            // Returns 201 Created with a Location header pointing to GetById.
            return CreatedAtAction(nameof(GetByIdAsync), new { id = season.Id }, result);
        }

        /// <summary>
        /// Updates an existing season.
        /// </summary>
        /// <param name="id">The identifier of the season to update.</param>
        /// <param name="request">The updated season details.</param>
        /// <returns>No content on success.</returns>
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, [FromBody] UpdateSeasonDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (request.StartDate > request.EndDate)
            {
                ModelState.AddModelError(nameof(request.EndDate), "End date must be after start date.");
                return BadRequest(ModelState);
            }

            var season = await _dbContext.Seasons.FindAsync(id);

            if (season == null)
            {
                return NotFound();
            }

            season.Name = request.Name;
            season.Description = request.Description;
            season.StartDate = request.StartDate;
            season.EndDate = request.EndDate;

            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        /// <summary>
        /// Deletes an existing season.
        /// </summary>
        /// <param name="id">The identifier of the season to delete.</param>
        /// <returns>No content on success.</returns>
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var season = await _dbContext.Seasons.FindAsync(id);

            if (season == null)
            {
                return NotFound();
            }

            _dbContext.Seasons.Remove(season);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
