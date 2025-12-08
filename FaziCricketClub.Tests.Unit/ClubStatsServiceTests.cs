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
    /// <summary>
    /// Unit tests for <see cref="ClubStatsService"/>.
    /// Verifies aggregation logic over members and fixtures.
    /// </summary>
    public class ClubStatsServiceTests
    {
        private readonly Mock<IMemberRepository> _memberRepositoryMock;
        private readonly Mock<IFixtureRepository> _fixtureRepositoryMock;
        private readonly ClubStatsService _sut;

        public ClubStatsServiceTests()
        {
            _memberRepositoryMock = new Mock<IMemberRepository>(MockBehavior.Strict);
            _fixtureRepositoryMock = new Mock<IFixtureRepository>(MockBehavior.Strict);

            _sut = new ClubStatsService(
                _memberRepositoryMock.Object,
                _fixtureRepositoryMock.Object);
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
                new Fixture { Id = 3, Status = "scheduled" }, // test case insensitivity
                new Fixture { Id = 4, Status = "Other" }
            };

            _memberRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(members);

            _fixtureRepositoryMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixtures);

            // ACT
            var result = await _sut.GetClubStatsAsync();

            // ASSERT
            result.TotalMembers.Should().Be(3);
            result.ActiveMembers.Should().Be(2);
            result.InactiveMembers.Should().Be(1);

            result.TotalFixtures.Should().Be(4);
            result.ScheduledFixtures.Should().Be(2);   // "Scheduled" + "scheduled"
            result.CompletedFixtures.Should().Be(1);   // "Completed"

            _memberRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.Verify(r => r.GetAllAsync(It.IsAny<CancellationToken>()), Times.Once);

            _memberRepositoryMock.VerifyNoOtherCalls();
            _fixtureRepositoryMock.VerifyNoOtherCalls();
        }
    }
}
