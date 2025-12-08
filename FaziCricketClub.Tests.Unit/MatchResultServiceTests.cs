using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Application.Services;
using FaziCricketClub.Domain.Entities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Tests.Unit
{
    public class MatchResultServiceTests
    {
        private readonly Mock<IFixtureRepository> _fixtureRepositoryMock;
        private readonly Mock<IMatchResultRepository> _matchResultRepositoryMock;
        private readonly Mock<IBattingScoreRepository> _battingScoreRepositoryMock;
        private readonly Mock<IBowlingFigureRepository> _bowlingFigureRepositoryMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly Mock<ILogger<MatchResultService>> _loggerMock;

        private readonly IMatchResultService _sut;

        public MatchResultServiceTests()
        {
            _fixtureRepositoryMock = new Mock<IFixtureRepository>(MockBehavior.Strict);
            _matchResultRepositoryMock = new Mock<IMatchResultRepository>(MockBehavior.Strict);
            _battingScoreRepositoryMock = new Mock<IBattingScoreRepository>(MockBehavior.Strict);
            _bowlingFigureRepositoryMock = new Mock<IBowlingFigureRepository>(MockBehavior.Strict);
            _unitOfWorkMock = new Mock<IUnitOfWork>(MockBehavior.Strict);
            _loggerMock = new Mock<ILogger<MatchResultService>>();

            _sut = new MatchResultService(
                _fixtureRepositoryMock.Object,
                _matchResultRepositoryMock.Object,
                _battingScoreRepositoryMock.Object,
                _bowlingFigureRepositoryMock.Object,
                _unitOfWorkMock.Object,
                _loggerMock.Object);
        }

        
        [Fact]
        public async Task GetByFixtureIdAsync_ShouldReturnNull_WhenNoResultExists()
        {
            // ARRANGE
            const int fixtureId = 123;

            _matchResultRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((MatchResult?)null);

            // ACT
            var result = await _sut.GetByFixtureIdAsync(fixtureId);

            // ASSERT
            result.Should().BeNull();

            _matchResultRepositoryMock.Verify(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);
            _matchResultRepositoryMock.VerifyNoOtherCalls();
            _battingScoreRepositoryMock.VerifyNoOtherCalls();
            _bowlingFigureRepositoryMock.VerifyNoOtherCalls();
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }


        [Fact]
        public async Task GetByFixtureIdAsync_ShouldReturnDetailDto_WhenResultAndScorecardsExist()
        {
            // ARRANGE
            const int fixtureId = 10;

            var matchResult = new MatchResult
            {
                Id = 1,
                FixtureId = fixtureId,
                HomeTeamRuns = 150,
                HomeTeamWickets = 7,
                AwayTeamRuns = 140,
                AwayTeamWickets = 10,
                ResultSummary = "Home won by 10 runs",
                WinningTeamId = 100,
                PlayerOfTheMatchMemberId = 200,
                Notes = "Good game"
            };

            var battingScores = new List<BattingScore>
            {
                new BattingScore
                {
                    Id = 1,
                    FixtureId = fixtureId,
                    TeamId = 100,
                    MemberId = 201,
                    BattingOrder = 1,
                    Runs = 60,
                    Balls = 45,
                    Fours = 8,
                    Sixes = 1,
                    IsOut = true
                }
            };

            var bowlingFigures = new List<BowlingFigure>
            {
                new BowlingFigure
                {
                    Id = 1,
                    FixtureId = fixtureId,
                    TeamId = 200,
                    MemberId = 301,
                    Overs = 4.0m,
                    Maidens = 0,
                    RunsConceded = 25,
                    Wickets = 2,
                    NoBalls = 1,
                    Wides = 2
                }
            };

            _matchResultRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(matchResult);

            _battingScoreRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(battingScores);

            _bowlingFigureRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(bowlingFigures);

            // ACT
            var result = await _sut.GetByFixtureIdAsync(fixtureId);

            // ASSERT
            result.Should().NotBeNull();
            result!.FixtureId.Should().Be(fixtureId);
            result.MatchResultId.Should().Be(1);
            result.HomeTeamRuns.Should().Be(150);
            result.AwayTeamRuns.Should().Be(140);
            result.ResultSummary.Should().Be("Home won by 10 runs");
            result.WinningTeamId.Should().Be(100);
            result.PlayerOfTheMatchMemberId.Should().Be(200);
            result.BattingScores.Should().HaveCount(1);
            result.BowlingFigures.Should().HaveCount(1);

            _matchResultRepositoryMock.Verify(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);
            _battingScoreRepositoryMock.Verify(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);
            _bowlingFigureRepositoryMock.Verify(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);

            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpsertMatchResultAsync_ShouldThrow_WhenFixtureNotFoundOrDeleted()
        {
            // ARRANGE
            const int fixtureId = 10;

            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((Fixture?)null);

            var request = new MatchResultUpsertDto();

            // ACT
            var act = () => _sut.UpsertMatchResultAsync(fixtureId, request);

            // ASSERT
            await act.Should().ThrowAsync<KeyNotFoundException>();

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);
            _matchResultRepositoryMock.VerifyNoOtherCalls();
            _battingScoreRepositoryMock.VerifyNoOtherCalls();
            _bowlingFigureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task UpsertMatchResultAsync_ShouldCreateNewResultAndScorecardsAndMarkFixtureCompleted()
        {
            // ARRANGE
            const int fixtureId = 10;

            var fixture = new Fixture
            {
                Id = fixtureId,
                Status = "Scheduled",
                IsDeleted = false
            };

            var request = new MatchResultUpsertDto
            {
                HomeTeamRuns = 180,
                HomeTeamWickets = 6,
                HomeTeamOvers = 20.0m,
                AwayTeamRuns = 150,
                AwayTeamWickets = 9,
                AwayTeamOvers = 20.0m,
                ResultSummary = "Home won by 30 runs",
                WinningTeamId = 100,
                PlayerOfTheMatchMemberId = 200,
                Notes = "Sunny day",
                BattingScores = new List<BattingScoreDto>
                {
                    new()
                    {
                        TeamId = 100,
                        MemberId = 201,
                        BattingOrder = 1,
                        Runs = 70,
                        Balls = 50,
                        Fours = 10,
                        Sixes = 1,
                        IsOut = true
                    }
                },
                BowlingFigures = new List<BowlingFigureDto>
                {
                    new()
                    {
                        TeamId = 200,
                        MemberId = 301,
                        Overs = 4.0m,
                        Maidens = 0,
                        RunsConceded = 25,
                        Wickets = 2,
                        NoBalls = 0,
                        Wides = 1
                    }
                }
            };

            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixture);

            // No existing match result
            _matchResultRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((MatchResult?)null);

            _matchResultRepositoryMock
                .Setup(r => r.AddAsync(It.IsAny<MatchResult>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            _battingScoreRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BattingScore>());

            _bowlingFigureRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BowlingFigure>());

            _battingScoreRepositoryMock
                .Setup(r => r.AddRangeAsync(It.IsAny<IEnumerable<BattingScore>>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            _bowlingFigureRepositoryMock
                .Setup(r => r.AddRangeAsync(It.IsAny<IEnumerable<BowlingFigure>>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            _fixtureRepositoryMock
                .Setup(r => r.Update(fixture));

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // When reloading after save, return a concrete MatchResult
            _matchResultRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new MatchResult
                {
                    Id = 1,
                    FixtureId = fixtureId,
                    HomeTeamRuns = request.HomeTeamRuns,
                    HomeTeamWickets = request.HomeTeamWickets,
                    HomeTeamOvers = request.HomeTeamOvers,
                    AwayTeamRuns = request.AwayTeamRuns,
                    AwayTeamWickets = request.AwayTeamWickets,
                    AwayTeamOvers = request.AwayTeamOvers,
                    ResultSummary = request.ResultSummary,
                    WinningTeamId = request.WinningTeamId,
                    PlayerOfTheMatchMemberId = request.PlayerOfTheMatchMemberId,
                    Notes = request.Notes
                });

            // For reload of batting/bowling after save
            _battingScoreRepositoryMock
                .SetupSequence(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BattingScore>())     // first call (pre-remove)
                .ReturnsAsync(new List<BattingScore>       // second call (post-save)
                {
                    new()
                    {
                        Id = 1,
                        FixtureId = fixtureId,
                        TeamId = 100,
                        MemberId = 201,
                        BattingOrder = 1,
                        Runs = 70,
                        Balls = 50,
                        Fours = 10,
                        Sixes = 1,
                        IsOut = true
                    }
                });

            _bowlingFigureRepositoryMock
                .SetupSequence(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BowlingFigure>())    // first call (pre-remove)
                .ReturnsAsync(new List<BowlingFigure>      // second call (post-save)
                {
                    new()
                    {
                        Id = 1,
                        FixtureId = fixtureId,
                        TeamId = 200,
                        MemberId = 301,
                        Overs = 4.0m,
                        Maidens = 0,
                        RunsConceded = 25,
                        Wickets = 2,
                        NoBalls = 0,
                        Wides = 1
                    }
                });

            // ACT
            var result = await _sut.UpsertMatchResultAsync(fixtureId, request);

            // ASSERT
            result.Should().NotBeNull();
            result.FixtureId.Should().Be(fixtureId);
            result.HomeTeamRuns.Should().Be(180);
            result.BattingScores.Should().HaveCount(1);
            result.BowlingFigures.Should().HaveCount(1);

            fixture.Status.Should().Be("Completed");

            _fixtureRepositoryMock.Verify(r => r.GetByIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);
            _fixtureRepositoryMock.Verify(r => r.Update(fixture), Times.Once);

            _matchResultRepositoryMock.Verify(r => r.AddAsync(It.IsAny<MatchResult>(), It.IsAny<CancellationToken>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeleteMatchResultAsync_ShouldDoNothing_WhenNoResultExists()
        {
            // ARRANGE
            const int fixtureId = 10;

            _matchResultRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync((MatchResult?)null);

            // ACT
            await _sut.DeleteMatchResultAsync(fixtureId);

            // ASSERT
            _matchResultRepositoryMock.Verify(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()), Times.Once);
            _battingScoreRepositoryMock.VerifyNoOtherCalls();
            _bowlingFigureRepositoryMock.VerifyNoOtherCalls();
            _fixtureRepositoryMock.VerifyNoOtherCalls();
            _unitOfWorkMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task DeleteMatchResultAsync_ShouldRemoveResultAndScorecardsAndResetFixtureStatus()
        {
            // ARRANGE
            const int fixtureId = 10;

            var matchResult = new MatchResult
            {
                Id = 1,
                FixtureId = fixtureId
            };

            var battingScores = new List<BattingScore>
            {
                new() { Id = 1, FixtureId = fixtureId, MemberId = 201, TeamId = 100 }
            };

            var bowlingFigures = new List<BowlingFigure>
            {
                new() { Id = 1, FixtureId = fixtureId, MemberId = 301, TeamId = 200 }
            };

            var fixture = new Fixture
            {
                Id = fixtureId,
                Status = "Completed",
                IsDeleted = false
            };

            _matchResultRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(matchResult);

            _battingScoreRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(battingScores);

            _bowlingFigureRepositoryMock
                .Setup(r => r.GetByFixtureIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(bowlingFigures);

            _battingScoreRepositoryMock
                .Setup(r => r.RemoveRange(battingScores));

            _bowlingFigureRepositoryMock
                .Setup(r => r.RemoveRange(bowlingFigures));

            _matchResultRepositoryMock
                .Setup(r => r.Remove(matchResult));

            _fixtureRepositoryMock
                .Setup(r => r.GetByIdAsync(fixtureId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(fixture);

            _fixtureRepositoryMock
                .Setup(r => r.Update(fixture));

            _unitOfWorkMock
                .Setup(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // ACT
            await _sut.DeleteMatchResultAsync(fixtureId);

            // ASSERT
            fixture.Status.Should().Be("Scheduled");

            _battingScoreRepositoryMock.Verify(r => r.RemoveRange(battingScores), Times.Once);
            _bowlingFigureRepositoryMock.Verify(r => r.RemoveRange(bowlingFigures), Times.Once);
            _matchResultRepositoryMock.Verify(r => r.Remove(matchResult), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }


    }
}
