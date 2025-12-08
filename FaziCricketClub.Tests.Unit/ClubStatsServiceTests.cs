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
        private readonly ClubStatsService _sut;

        public ClubStatsServiceTests()
        {
            _memberRepositoryMock = new Mock<IMemberRepository>(MockBehavior.Strict);
            _fixtureRepositoryMock = new Mock<IFixtureRepository>(MockBehavior.Strict);
            _seasonRepositoryMock = new Mock<ISeasonRepository>(MockBehavior.Strict);

            _sut = new ClubStatsService(
                _memberRepositoryMock.Object,
                _fixtureRepositoryMock.Object,
                _seasonRepositoryMock.Object);
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
    }
}
