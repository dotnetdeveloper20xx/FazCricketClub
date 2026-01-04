using FaziCricketClub.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace FaziCricketClub.API.Controllers
{
    /// <summary>
    /// API controller for seeding and clearing database data in Development mode.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SeedController : ControllerBase
    {
        private readonly MainDatabaseSeeder seeder;
        private readonly IWebHostEnvironment environment;
        private readonly ILogger<SeedController> logger;

        public SeedController(
            MainDatabaseSeeder seeder,
            IWebHostEnvironment environment,
            ILogger<SeedController> logger)
        {
            this.seeder = seeder ?? throw new ArgumentNullException(nameof(seeder));
            this.environment = environment ?? throw new ArgumentNullException(nameof(environment));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Seeds the database with sample data.
        /// Only available in Development environment.
        /// </summary>
        /// <param name="clearExisting">If true, clears all existing data before seeding.</param>
        /// <returns>Summary of seeded data.</returns>
        [HttpPost("data")]
        public async Task<IActionResult> SeedData([FromQuery] bool clearExisting = false)
        {
            // Only allow in Development
            if (!this.environment.IsDevelopment())
            {
                this.logger.LogWarning("Seed data endpoint called in non-Development environment.");
                return BadRequest(new
                {
                    error = "Seeding is only available in Development environment"
                });
            }

            this.logger.LogInformation("Seeding data via API. Clear existing: {ClearExisting}", clearExisting);

            try
            {
                var summary = await this.seeder.SeedAllAsync(clearExisting);

                return Ok(new
                {
                    message = "Seeding completed successfully",
                    clearedExisting = clearExisting,
                    summary = new
                    {
                        teamsCreated = summary.TeamsCreated,
                        membersCreated = summary.MembersCreated,
                        seasonsCreated = summary.SeasonsCreated,
                        fixturesCreated = summary.FixturesCreated,
                        matchResultsCreated = summary.MatchResultsCreated,
                        battingScoresCreated = summary.BattingScoresCreated,
                        bowlingFiguresCreated = summary.BowlingFiguresCreated
                    }
                });
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error occurred while seeding data.");
                return StatusCode(500, new
                {
                    error = "An error occurred while seeding data. Check logs for details."
                });
            }
        }

        /// <summary>
        /// Clears all data from the database.
        /// Only available in Development environment.
        /// </summary>
        /// <returns>Success message.</returns>
        [HttpDelete("data")]
        public async Task<IActionResult> ClearData()
        {
            // Only allow in Development
            if (!this.environment.IsDevelopment())
            {
                this.logger.LogWarning("Clear data endpoint called in non-Development environment.");
                return BadRequest(new
                {
                    error = "Data clearing is only available in Development environment"
                });
            }

            this.logger.LogInformation("Clearing all data via API.");

            try
            {
                await this.seeder.ClearAllDataAsync();

                return Ok(new
                {
                    message = "All data cleared successfully"
                });
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Error occurred while clearing data.");
                return StatusCode(500, new
                {
                    error = "An error occurred while clearing data. Check logs for details."
                });
            }
        }
    }
}
