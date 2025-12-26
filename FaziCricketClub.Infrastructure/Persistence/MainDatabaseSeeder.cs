using FaziCricketClub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace FaziCricketClub.Infrastructure.Persistence
{
    /// <summary>
    /// Seeds the main database with realistic cricket club data for development and testing.
    ///
    /// Creates: Teams, Members, Seasons, Fixtures, Match Results, and scorecards.
    /// This seeder is idempotent - it checks for existing data before creating new records.
    /// </summary>
    public class MainDatabaseSeeder
    {
        private readonly CricketClubDbContext context;
        private readonly ILogger<MainDatabaseSeeder> logger;

        // Collections to hold created entities for cross-referencing
        private List<Team> teams = new();
        private List<Member> members = new();
        private List<Season> seasons = new();
        private List<Fixture> fixtures = new();

        public MainDatabaseSeeder(
            CricketClubDbContext context,
            ILogger<MainDatabaseSeeder> logger)
        {
            this.context = context ?? throw new ArgumentNullException(nameof(context));
            this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Seeds all data. Optionally clears existing data first.
        /// Returns a summary of what was created.
        /// </summary>
        public async Task<SeedSummary> SeedAllAsync(bool clearExisting = false)
        {
            this.logger.LogInformation("Starting main database seeding. Clear existing: {ClearExisting}", clearExisting);

            if (clearExisting)
            {
                await this.ClearAllDataAsync();
            }

            var summary = new SeedSummary();

            summary.TeamsCreated = await this.SeedTeamsAsync();
            summary.MembersCreated = await this.SeedMembersAsync();
            summary.SeasonsCreated = await this.SeedSeasonsAsync();
            summary.FixturesCreated = await this.SeedFixturesAsync();
            var matchResultStats = await this.SeedMatchResultsAsync();
            summary.MatchResultsCreated = matchResultStats.MatchResults;
            summary.BattingScoresCreated = matchResultStats.BattingScores;
            summary.BowlingFiguresCreated = matchResultStats.BowlingFigures;

            this.logger.LogInformation(
                "Main database seeding completed. Teams: {Teams}, Members: {Members}, Seasons: {Seasons}, Fixtures: {Fixtures}, Match Results: {MatchResults}",
                summary.TeamsCreated, summary.MembersCreated, summary.SeasonsCreated, summary.FixturesCreated, summary.MatchResultsCreated);

            return summary;
        }

        /// <summary>
        /// Clears all seeded data in reverse order to respect foreign key constraints.
        /// </summary>
        public async Task ClearAllDataAsync()
        {
            this.logger.LogInformation("Clearing all main database data...");

            // Delete in reverse dependency order
            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM BattingScores");
            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM BowlingFigures");
            this.logger.LogInformation("Cleared batting scores and bowling figures.");

            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM MatchResults");
            this.logger.LogInformation("Cleared match results.");

            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM FixtureAvailabilities");
            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM FixtureSelectionPlayers");
            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM FixtureSelections");
            this.logger.LogInformation("Cleared fixture selections and availabilities.");

            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM Fixtures");
            this.logger.LogInformation("Cleared fixtures.");

            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM Seasons");
            this.logger.LogInformation("Cleared seasons.");

            // Clear many-to-many relationship (if you have explicit join table)
            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM MemberTeam");
            this.logger.LogInformation("Cleared member-team relationships.");

            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM Members");
            this.logger.LogInformation("Cleared members.");

            await this.context.Database.ExecuteSqlRawAsync("DELETE FROM Teams");
            this.logger.LogInformation("Cleared teams.");

            this.logger.LogInformation("All main database data cleared successfully.");
        }

        private async Task<int> SeedTeamsAsync()
        {
            // Check if teams already exist
            if (await this.context.Teams.AnyAsync())
            {
                this.logger.LogInformation("Teams already exist. Skipping team seeding.");
                this.teams = await this.context.Teams.ToListAsync();
                return 0;
            }

            this.logger.LogInformation("Seeding teams...");

            this.teams = new List<Team>
            {
                new Team
                {
                    Name = "1st XI",
                    Description = "First team squad",
                    IsActive = true,
                    IsDeleted = false
                },
                new Team
                {
                    Name = "2nd XI",
                    Description = "Second team squad",
                    IsActive = true,
                    IsDeleted = false
                },
                new Team
                {
                    Name = "U19 Team",
                    Description = "Under 19 development squad",
                    IsActive = true,
                    IsDeleted = false
                },
                new Team
                {
                    Name = "Veterans XI",
                    Description = "Veterans and senior players",
                    IsActive = true,
                    IsDeleted = false
                },
                new Team
                {
                    Name = "Women's Team",
                    Description = "Women's cricket team",
                    IsActive = true,
                    IsDeleted = false
                }
            };

            await this.context.Teams.AddRangeAsync(this.teams);
            await this.context.SaveChangesAsync();

            this.logger.LogInformation("Created {Count} teams.", this.teams.Count);
            return this.teams.Count;
        }

        private async Task<int> SeedMembersAsync()
        {
            // Check if members already exist
            if (await this.context.Members.AnyAsync())
            {
                this.logger.LogInformation("Members already exist. Skipping member seeding.");
                this.members = await this.context.Members.ToListAsync();
                return 0;
            }

            this.logger.LogInformation("Seeding members...");

            var memberData = new[]
            {
                new { FirstName = "John", LastName = "Smith", Age = 28, Active = true },
                new { FirstName = "Michael", LastName = "Johnson", Age = 32, Active = true },
                new { FirstName = "David", LastName = "Williams", Age = 25, Active = true },
                new { FirstName = "Chris", LastName = "Brown", Age = 29, Active = true },
                new { FirstName = "Matthew", LastName = "Jones", Age = 26, Active = true },
                new { FirstName = "Daniel", LastName = "Garcia", Age = 31, Active = true },
                new { FirstName = "James", LastName = "Miller", Age = 24, Active = true },
                new { FirstName = "Robert", LastName = "Davis", Age = 35, Active = true },
                new { FirstName = "Sarah", LastName = "Wilson", Age = 27, Active = true },
                new { FirstName = "Emma", LastName = "Martinez", Age = 23, Active = true },
                new { FirstName = "Olivia", LastName = "Anderson", Age = 26, Active = true },
                new { FirstName = "Sophia", LastName = "Taylor", Age = 24, Active = true },
                new { FirstName = "Liam", LastName = "Moore", Age = 30, Active = true },
                new { FirstName = "Noah", LastName = "Jackson", Age = 22, Active = true },
                new { FirstName = "Ava", LastName = "White", Age = 25, Active = true },
                new { FirstName = "Isabella", LastName = "Harris", Age = 28, Active = true },
                new { FirstName = "Ethan", LastName = "Clark", Age = 33, Active = false },
                new { FirstName = "Mason", LastName = "Lewis", Age = 27, Active = true },
                new { FirstName = "Charlotte", LastName = "Walker", Age = 26, Active = false },
                new { FirstName = "Amelia", LastName = "Robinson", Age = 29, Active = true }
            };

            this.members = new List<Member>();
            var random = new Random(42); // Fixed seed for reproducibility

            foreach (var data in memberData)
            {
                var member = new Member
                {
                    FullName = $"{data.FirstName} {data.LastName}",
                    Email = $"{data.FirstName.ToLower()}.{data.LastName.ToLower()}@fazcricket.com",
                    PhoneNumber = $"+44 7{random.Next(100000000, 999999999)}",
                    DateOfBirth = DateTime.Now.AddYears(-data.Age).AddDays(random.Next(-180, 180)),
                    JoinedOn = DateTime.Now.AddYears(-random.Next(1, 4)).AddDays(random.Next(-30, 30)),
                    IsActive = data.Active,
                    Notes = data.Active ? null : "Inactive - on sabbatical",
                    IsDeleted = false
                };

                this.members.Add(member);
            }

            await this.context.Members.AddRangeAsync(this.members);
            await this.context.SaveChangesAsync();

            this.logger.LogInformation("Created {Count} members.", this.members.Count);
            return this.members.Count;
        }

        private async Task<int> SeedSeasonsAsync()
        {
            // Check if seasons already exist
            if (await this.context.Seasons.AnyAsync())
            {
                this.logger.LogInformation("Seasons already exist. Skipping season seeding.");
                this.seasons = await this.context.Seasons.ToListAsync();
                return 0;
            }

            this.logger.LogInformation("Seeding seasons...");

            this.seasons = new List<Season>
            {
                new Season
                {
                    Name = "Summer 2024",
                    Description = "Summer cricket season 2024",
                    StartDate = new DateTime(2024, 4, 1),
                    EndDate = new DateTime(2024, 9, 30),
                    IsDeleted = false
                },
                new Season
                {
                    Name = "Winter 2024",
                    Description = "Winter indoor cricket season 2024/2025",
                    StartDate = new DateTime(2024, 10, 1),
                    EndDate = new DateTime(2025, 3, 31),
                    IsDeleted = false
                },
                new Season
                {
                    Name = "Summer 2023",
                    Description = "Summer cricket season 2023",
                    StartDate = new DateTime(2023, 4, 1),
                    EndDate = new DateTime(2023, 9, 30),
                    IsDeleted = false
                }
            };

            await this.context.Seasons.AddRangeAsync(this.seasons);
            await this.context.SaveChangesAsync();

            this.logger.LogInformation("Created {Count} seasons.", this.seasons.Count);
            return this.seasons.Count;
        }

        private async Task<int> SeedFixturesAsync()
        {
            // Check if fixtures already exist
            if (await this.context.Fixtures.AnyAsync())
            {
                this.logger.LogInformation("Fixtures already exist. Skipping fixture seeding.");
                this.fixtures = await this.context.Fixtures.ToListAsync();
                return 0;
            }

            this.logger.LogInformation("Seeding fixtures...");

            // Ensure we have data to work with
            if (!this.teams.Any()) this.teams = await this.context.Teams.ToListAsync();
            if (!this.seasons.Any()) this.seasons = await this.context.Seasons.ToListAsync();

            if (!this.teams.Any() || !this.seasons.Any())
            {
                this.logger.LogWarning("Cannot seed fixtures - no teams or seasons exist.");
                return 0;
            }

            this.fixtures = new List<Fixture>();
            var random = new Random(42);
            var venues = new[] { "Home Ground", "Victory Park", "Central Stadium", "Riverside Cricket Club", "St. Mary's Field" };
            var competitions = new[] { "County League", "T20 Cup", "Friendly Match", "Championship", "Trophy Quarter Final" };

            // Create fixtures for available seasons
            // Use FirstOrDefault to avoid exceptions if seasons don't have expected names
            var summer2024 = this.seasons.FirstOrDefault(s => s.Name == "Summer 2024");
            if (summer2024 != null)
            {
                this.CreateFixturesForSeason(summer2024, 9, "Completed", random, venues, competitions);
                this.CreateFixturesForSeason(summer2024, 4, "Scheduled", random, venues, competitions);
            }
            else if (this.seasons.Any())
            {
                // Fallback: use the first available season
                var firstSeason = this.seasons.First();
                this.CreateFixturesForSeason(firstSeason, 9, "Completed", random, venues, competitions);
                this.CreateFixturesForSeason(firstSeason, 4, "Scheduled", random, venues, competitions);
            }

            var summer2023 = this.seasons.FirstOrDefault(s => s.Name == "Summer 2023");
            if (summer2023 != null)
            {
                this.CreateFixturesForSeason(summer2023, 1, "Cancelled", random, venues, competitions);
                this.CreateFixturesForSeason(summer2023, 1, "Completed", random, venues, competitions);
            }
            else if (this.seasons.Count() >= 2)
            {
                // Fallback: use the second available season if exists
                var secondSeason = this.seasons.Skip(1).First();
                this.CreateFixturesForSeason(secondSeason, 1, "Cancelled", random, venues, competitions);
                this.CreateFixturesForSeason(secondSeason, 1, "Completed", random, venues, competitions);
            }

            await this.context.Fixtures.AddRangeAsync(this.fixtures);
            await this.context.SaveChangesAsync();

            this.logger.LogInformation("Created {Count} fixtures.", this.fixtures.Count);
            return this.fixtures.Count;
        }

        private void CreateFixturesForSeason(Season season, int count, string status, Random random, string[] venues, string[] competitions)
        {
            for (int i = 0; i < count; i++)
            {
                var dayOffset = random.Next((season.EndDate - season.StartDate).Days);
                var fixtureDate = season.StartDate.AddDays(dayOffset).AddHours(14); // 2 PM start

                var homeTeam = this.teams[random.Next(this.teams.Count)];
                Team awayTeam;
                do
                {
                    awayTeam = this.teams[random.Next(this.teams.Count)];
                } while (awayTeam.Id == homeTeam.Id);

                this.fixtures.Add(new Fixture
                {
                    SeasonId = season.Id,
                    HomeTeamId = homeTeam.Id,
                    AwayTeamId = awayTeam.Id,
                    StartDateTime = fixtureDate,
                    Venue = venues[random.Next(venues.Length)],
                    CompetitionName = competitions[random.Next(competitions.Length)],
                    Status = status,
                    IsDeleted = false
                });
            }
        }

        private async Task<(int MatchResults, int BattingScores, int BowlingFigures)> SeedMatchResultsAsync()
        {
            // Check if match results already exist
            if (await this.context.MatchResults.AnyAsync())
            {
                this.logger.LogInformation("Match results already exist. Skipping match result seeding.");
                return (0, 0, 0);
            }

            this.logger.LogInformation("Seeding match results...");

            // Ensure we have data
            if (!this.fixtures.Any()) this.fixtures = await this.context.Fixtures.ToListAsync();
            if (!this.members.Any()) this.members = await this.context.Members.ToListAsync();

            var completedFixtures = this.fixtures.Where(f => f.Status == "Completed").Take(8).ToList();

            if (!completedFixtures.Any())
            {
                this.logger.LogWarning("No completed fixtures found for match results.");
                return (0, 0, 0);
            }

            var random = new Random(42);
            int totalBattingScores = 0;
            int totalBowlingFigures = 0;

            foreach (var fixture in completedFixtures)
            {
                // Generate realistic match scores
                var homeTeamRuns = random.Next(120, 281);
                var homeTeamWickets = random.Next(4, 11);
                var homeTeamOvers = (decimal)(random.Next(35, 51) + random.NextDouble());

                var awayTeamRuns = random.Next(120, 281);
                var awayTeamWickets = random.Next(4, 11);
                var awayTeamOvers = (decimal)(random.Next(35, 51) + random.NextDouble());

                var winningTeamId = homeTeamRuns > awayTeamRuns ? fixture.HomeTeamId : fixture.AwayTeamId;
                var playerOfTheMatch = this.members[random.Next(this.members.Count)];

                var matchResult = new MatchResult
                {
                    FixtureId = fixture.Id,
                    HomeTeamRuns = homeTeamRuns,
                    HomeTeamWickets = homeTeamWickets,
                    HomeTeamOvers = homeTeamOvers,
                    AwayTeamRuns = awayTeamRuns,
                    AwayTeamWickets = awayTeamWickets,
                    AwayTeamOvers = awayTeamOvers,
                    ResultSummary = homeTeamRuns > awayTeamRuns
                        ? $"Home team won by {homeTeamRuns - awayTeamRuns} runs"
                        : $"Away team won by {awayTeamWickets - homeTeamWickets} wickets",
                    WinningTeamId = winningTeamId,
                    PlayerOfTheMatchMemberId = playerOfTheMatch.Id,
                    Notes = null
                };

                await this.context.MatchResults.AddAsync(matchResult);

                // Create batting scores for home team
                totalBattingScores += await this.CreateBattingScoresForTeam(
                    fixture.Id, fixture.HomeTeamId, homeTeamRuns, random);

                // Create batting scores for away team
                totalBattingScores += await this.CreateBattingScoresForTeam(
                    fixture.Id, fixture.AwayTeamId, awayTeamRuns, random);

                // Create bowling figures for home team (bowling against away team)
                totalBowlingFigures += await this.CreateBowlingFiguresForTeam(
                    fixture.Id, fixture.HomeTeamId, awayTeamRuns, awayTeamWickets, random);

                // Create bowling figures for away team (bowling against home team)
                totalBowlingFigures += await this.CreateBowlingFiguresForTeam(
                    fixture.Id, fixture.AwayTeamId, homeTeamRuns, homeTeamWickets, random);
            }

            await this.context.SaveChangesAsync();

            this.logger.LogInformation(
                "Created {MatchResults} match results with {BattingScores} batting scores and {BowlingFigures} bowling figures.",
                completedFixtures.Count, totalBattingScores, totalBowlingFigures);

            return (completedFixtures.Count, totalBattingScores, totalBowlingFigures);
        }

        private async Task<int> CreateBattingScoresForTeam(int fixtureId, int teamId, int totalRuns, Random random)
        {
            var battingScores = new List<BattingScore>();
            int remainingRuns = totalRuns;
            int playersCount = 11;

            for (int i = 1; i <= playersCount; i++)
            {
                var member = this.members[random.Next(this.members.Count)];

                int runs;
                if (i == playersCount)
                {
                    // Last batsman gets whatever is remaining
                    runs = Math.Max(0, remainingRuns);
                }
                else
                {
                    // Distribute runs realistically with safety checks
                    int maxRuns;
                    int minRuns;

                    if (i == 1)
                    {
                        // Top scorer: 50-80 runs
                        minRuns = Math.Min(50, remainingRuns);
                        maxRuns = Math.Min(81, remainingRuns + 1);
                    }
                    else if (i <= 6)
                    {
                        // Middle order: 10-40 runs
                        minRuns = Math.Min(10, remainingRuns);
                        maxRuns = Math.Min(41, remainingRuns + 1);
                    }
                    else
                    {
                        // Tail enders: 0-15 runs
                        minRuns = 0;
                        maxRuns = Math.Min(16, remainingRuns + 1);
                    }

                    // Ensure maxRuns is always greater than minRuns
                    if (maxRuns <= minRuns)
                    {
                        runs = minRuns;
                    }
                    else
                    {
                        runs = random.Next(minRuns, maxRuns);
                    }
                }

                remainingRuns -= runs;

                var balls = runs == 0 ? random.Next(0, 5) : (int)(runs * (1 + random.NextDouble() * 0.5));
                var fours = runs / random.Next(6, 10);
                var sixes = runs / random.Next(20, 40);

                battingScores.Add(new BattingScore
                {
                    FixtureId = fixtureId,
                    TeamId = teamId,
                    MemberId = member.Id,
                    BattingOrder = i,
                    Runs = runs,
                    Balls = balls,
                    Fours = fours,
                    Sixes = sixes,
                    IsOut = random.Next(10) < 7, // 70% chance of being out
                    DismissalType = random.Next(10) < 7 ? (random.Next(3) == 0 ? "Bowled" : random.Next(2) == 0 ? "Caught" : "LBW") : null,
                    DismissalBowlerMemberId = null,
                    DismissalFielderMemberId = null,
                    Notes = null
                });
            }

            await this.context.BattingScores.AddRangeAsync(battingScores);
            return battingScores.Count;
        }

        private async Task<int> CreateBowlingFiguresForTeam(int fixtureId, int teamId, int runsAgainst, int wicketsAgainst, Random random)
        {
            var bowlingFigures = new List<BowlingFigure>();
            int bowlersCount = random.Next(4, 6); // 4-5 bowlers
            int remainingRuns = runsAgainst;
            int remainingWickets = wicketsAgainst;

            for (int i = 0; i < bowlersCount; i++)
            {
                var member = this.members[random.Next(this.members.Count)];

                int wickets = i == 0 ? random.Next(2, Math.Min(5, remainingWickets + 1)) : random.Next(0, Math.Min(3, remainingWickets + 1));
                if (i == bowlersCount - 1) wickets = remainingWickets;
                remainingWickets -= wickets;

                var overs = (decimal)(random.Next(6, 11) + random.NextDouble());
                int runsConceded = i == bowlersCount - 1 ? remainingRuns : random.Next(20, Math.Min(61, remainingRuns + 1));
                remainingRuns -= runsConceded;

                bowlingFigures.Add(new BowlingFigure
                {
                    FixtureId = fixtureId,
                    TeamId = teamId,
                    MemberId = member.Id,
                    Overs = overs,
                    Maidens = random.Next(0, 3),
                    RunsConceded = runsConceded,
                    Wickets = wickets,
                    NoBalls = random.Next(0, 4),
                    Wides = random.Next(0, 6),
                    Notes = null
                });
            }

            await this.context.BowlingFigures.AddRangeAsync(bowlingFigures);
            return bowlingFigures.Count;
        }
    }

    /// <summary>
    /// Summary of seeded data counts.
    /// </summary>
    public class SeedSummary
    {
        public int TeamsCreated { get; set; }
        public int MembersCreated { get; set; }
        public int SeasonsCreated { get; set; }
        public int FixturesCreated { get; set; }
        public int MatchResultsCreated { get; set; }
        public int BattingScoresCreated { get; set; }
        public int BowlingFiguresCreated { get; set; }
    }
}
