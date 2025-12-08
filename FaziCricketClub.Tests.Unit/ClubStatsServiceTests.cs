using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Application.Services;
using FaziCricketClub.Domain.Entities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Tests.Unit
{
    public class ClubStatsServiceTests
    {
        private readonly Mock<IMemberRepository> _memberRepositoryMock;
        private readonly Mock<IFixtureRepository> _fixtureRepositoryMock;
        private readonly Mock<ISeasonRepository> _seasonRepositoryMock;
        private readonly Mock<ITeamRepository> _teamRepositoryMock;
        private readonly ClubStatsService _sut;

        public ClubStatsServiceTests()
        {
            _memberRepositoryMock = new Mock<IMemberRepository>(MockBehavior.Strict);
            _fixtureRepositoryMock = new Mock<IFixtureRepository>(MockBehavior.Strict);
            _seasonRepositoryMock = new Mock<ISeasonRepository>(MockBehavior.Strict);
            _teamRepositoryMock = new Mock<ITeamRepository>(MockBehavior.Strict);

            _sut = new ClubStatsService(
                _memberRepositoryMock.Object,
                _fixtureRepositoryMock.Object,
                _seasonRepositoryMock.Object,
                _teamRepositoryMock.Object);
        }

        [Fact]
        public async Task GetTeamFixtureStatsAsync_ShouldAggregateFixturesPerTeam()
        {
            // ARRANGE
            var now = DateTime.UtcNow;

            var teams = new List<Team>
            {
                new Team { Id = 10, Name = "First XI" },
                new Team { Id = 20, Name = "Second XI" }
            };

            var fixtures = new List<Fixture>
            {
                // Team 10 home vs Team 20, completed
                new Fixture
                {
                    Id = 1,
                    HomeTeamId = 10,
                    AwayTeamId = 20,
                    StartDateTime = now.AddDays(-1),
                    Status = "Completed"
                },
                // Team 10 away vs someone else, upcoming scheduled
                new Fixture
                {
                    Id = 2,
                    HomeTeamId = 30,
                    AwayTeamId = 10,
                    StartDateTime = now.AddDays(2),
                    Status = "Scheduled"
                },
                // Team 20 home vs someone else, upcoming planned
                new Fixture
                {
                    Id = 3,
                    HomeTeamId = 20,
                    AwayTeamId = 40,
                    StartDateTime = now.AddDays(3),
                    Status = "Planned"
                },
                // Team 20 away vs someone else, other status
                new Fixture
                {
                    Id = 4,
                    HomeTeamId = 50,
                    AwayTeamId = 20,
                    StartDateTime = now.AddDays(4),
                    Status = "Other"
                }
            };

            _teamRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(teams);

            _fixtureRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixtures);

            // ACT
            var result = await _sut.GetTeamFixtureStatsAsync();

            // ASSERT
            result.Should().HaveCount(2);

            var team10 = result.Single(r => r.TeamId == 10);
            team10.TeamName.Should().Be("First XI");
            team10.TotalFixtures.Should().Be(2);      // Id 1,2
            team10.HomeFixtures.Should().Be(1);       // Id 1
            team10.AwayFixtures.Should().Be(1);       // Id 2
            team10.CompletedFixtures.Should().Be(1);  // Id 1
            team10.UpcomingFixtures.Should().Be(1);   // Id 2 (future + scheduled)

            var team20 = result.Single(r => r.TeamId == 20);
            team20.TeamName.Should().Be("Second XI");
            team20.TotalFixtures.Should().Be(3);      // Id 1,3,4
            team20.HomeFixtures.Should().Be(1);       // Id 3
            team20.AwayFixtures.Should().Be(2);       // Id 1,4
            team20.CompletedFixtures.Should().Be(1);  // Id 1
            team20.UpcomingFixtures.Should().Be(1);   // Id 3 (future + planned)

            _teamRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);

            _memberRepositoryMock.VerifyNoOtherCalls();
            _seasonRepositoryMock.VerifyNoOtherCalls();
            _teamRepositoryMock.VerifyNoOtherCalls();
            _fixtureRepositoryMock.VerifyNoOtherCalls();
        }


        [Fact]
        public async Task GetClubStatsAsync_ShouldAggregateMemberAndFixtureCounts()
        {
            // ARRANGE
            var members = new List<Member>
            {
                new Member { Id = 1, FullName = "Adam", IsActive = true },
                new Member { Id = 2, FullName = "Beth", IsActive = false },
                new Member { Id = 3, FullName = "Charlie", IsActive = true }
            };

            var fixtures = new List<Fixture>
            {
                new Fixture { Id = 1, Status = "Scheduled" },
                new Fixture { Id = 2, Status = "Completed" },
                new Fixture { Id = 3, Status = "scheduled" },
                new Fixture { Id = 4, Status = "Other" }
            };

            _memberRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(members);

            _fixtureRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixtures);

            // Season repo is not used in this method, but we keep it strict and expect no calls.
            _seasonRepositoryMock.VerifyNoOtherCalls();

            // ACT
            var result = await _sut.GetClubStatsAsync();

            // ASSERT
            result.TotalMembers.Should().Be(3);
            result.ActiveMembers.Should().Be(2);
            result.InactiveMembers.Should().Be(1);

            result.TotalFixtures.Should().Be(4);
            result.ScheduledFixtures.Should().Be(2);
            result.CompletedFixtures.Should().Be(1);

            _memberRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);

            _memberRepositoryMock.VerifyNoOtherCalls();
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _seasonRepositoryMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetSeasonFixtureStatsAsync_ShouldGroupFixturesBySeason()
        {
            // ARRANGE
            var seasons = new List<Season>
            {
                new Season { Id = 1, Name = "2025 Summer" },
                new Season { Id = 2, Name = "2025 Winter" }
            };

            var fixtures = new List<Fixture>
            {
                new Fixture { Id = 1, SeasonId = 1, Status = "Scheduled" },
                new Fixture { Id = 2, SeasonId = 1, Status = "Completed" },
                new Fixture { Id = 3, SeasonId = 1, Status = "Other" },
                new Fixture { Id = 4, SeasonId = 2, Status = "Scheduled" }
            };

            _seasonRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(seasons);

            _fixtureRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixtures);

            // member repo not used here
            _memberRepositoryMock.VerifyNoOtherCalls();

            // ACT
            var result = await _sut.GetSeasonFixtureStatsAsync();

            // ASSERT
            result.Should().HaveCount(2);

            var season1 = result.Single(r => r.SeasonId == 1);
            season1.SeasonName.Should().Be("2025 Summer");
            season1.TotalFixtures.Should().Be(3);
            season1.ScheduledFixtures.Should().Be(1);
            season1.CompletedFixtures.Should().Be(1);
            season1.OtherFixtures.Should().Be(1);

            var season2 = result.Single(r => r.SeasonId == 2);
            season2.SeasonName.Should().Be("2025 Winter");
            season2.TotalFixtures.Should().Be(1);
            season2.ScheduledFixtures.Should().Be(1);
            season2.CompletedFixtures.Should().Be(0);
            season2.OtherFixtures.Should().Be(0);

            _seasonRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);

            _memberRepositoryMock.VerifyNoOtherCalls();
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _seasonRepositoryMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetFixtureActivityOverTimeAsync_ShouldGroupFixturesByYearAndMonthAndApplyFilters()
        {
            // ARRANGE
            // Fix dates so test is deterministic.
            var jan2025 = new DateTime(2025, 1, 15);
            var feb2025 = new DateTime(2025, 2, 10);
            var mar2025 = new DateTime(2025, 3, 5);

            var fixtures = new List<Fixture>
    {
        // January: 2 fixtures (1 scheduled, 1 completed)
        new Fixture
        {
            Id = 1,
            SeasonId = 1,
            HomeTeamId = 10,
            AwayTeamId = 20,
            StartDateTime = jan2025,
            Status = "Scheduled"
        },
        new Fixture
        {
            Id = 2,
            SeasonId = 1,
            HomeTeamId = 10,
            AwayTeamId = 30,
            StartDateTime = jan2025.AddDays(5),
            Status = "Completed"
        },

        // February: 1 "other" fixture
        new Fixture
        {
            Id = 3,
            SeasonId = 2,
            HomeTeamId = 40,
            AwayTeamId = 10,
            StartDateTime = feb2025,
            Status = "Other"
        },

        // March: 1 scheduled fixture for another team
        new Fixture
        {
            Id = 4,
            SeasonId = 1,
            HomeTeamId = 50,
            AwayTeamId = 60,
            StartDateTime = mar2025,
            Status = "Scheduled"
        }
    };

            _fixtureRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixtures);

            // We only need fixture repo for this test; others should remain unused.
            _memberRepositoryMock.VerifyNoOtherCalls();
            _seasonRepositoryMock.VerifyNoOtherCalls();
            _teamRepositoryMock.VerifyNoOtherCalls();

            var from = new DateTime(2025, 1, 1);
            var to = new DateTime(2025, 3, 31);
            int? seasonId = 1;
            int? teamId = 10;

            // ACT
            var result = await _sut.GetFixtureActivityOverTimeAsync(from, to, seasonId, teamId);

            // ASSERT
            // With filters SeasonId = 1 and TeamId = 10:
            // - Jan fixtures: Id 1 (Scheduled), Id 2 (Completed) – both match.
            // - Feb fixture: Id 3 => SeasonId 2, but TeamId 10 (away). Should be excluded by SeasonId filter.
            // - Mar fixture: Id 4 => SeasonId 1, but neither home nor away team is 10. Excluded by TeamId filter.
            //
            // So we expect a single group (2025-01) with 2 fixtures.

            result.Should().HaveCount(1);

            var janPoint = result.Single();
            janPoint.Year.Should().Be(2025);
            janPoint.Month.Should().Be(1);
            janPoint.TotalFixtures.Should().Be(2);
            janPoint.ScheduledFixtures.Should().Be(1);
            janPoint.CompletedFixtures.Should().Be(1);
            janPoint.OtherFixtures.Should().Be(0);

            _fixtureRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.VerifyNoOtherCalls();
        }

    }
}
