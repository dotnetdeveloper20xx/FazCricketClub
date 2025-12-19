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
    public class PlayerStatsServiceTests
    {
        private readonly Mock<IBattingScoreRepository> _battingRepoMock;
        private readonly Mock<IBowlingFigureRepository> _bowlingRepoMock;
        private readonly Mock<IMemberRepository> _memberRepoMock;
        private readonly Mock<ISeasonRepository> _seasonRepoMock;
        private readonly Mock<ILogger<PlayerStatsService>> _loggerMock;

        private readonly IPlayerStatsService _sut;

        public PlayerStatsServiceTests()
        {
            _battingRepoMock = new Mock<IBattingScoreRepository>(MockBehavior.Strict);
            _bowlingRepoMock = new Mock<IBowlingFigureRepository>(MockBehavior.Strict);
            _memberRepoMock = new Mock<IMemberRepository>(MockBehavior.Strict);
            _seasonRepoMock = new Mock<ISeasonRepository>(MockBehavior.Strict);
            _loggerMock = new Mock<ILogger<PlayerStatsService>>();

            _sut = new PlayerStatsService(
                _battingRepoMock.Object,
                _bowlingRepoMock.Object,
                _memberRepoMock.Object,
                _seasonRepoMock.Object,
                _loggerMock.Object);
        }

        [Fact]
        public async Task GetBattingStatsAsync_ShouldReturnEmptyStats_WhenNoScores()
        {
            // ARRANGE
            const int memberId = 1;

            var member = new Member { Id = memberId, FullName = "Test Player", IsDeleted = false };

            _memberRepoMock
                .Setup(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            _battingRepoMock
                .Setup(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BattingScore>());

            // ACT
            var result = await _sut.GetBattingStatsAsync(memberId);

            // ASSERT
            result.MemberId.Should().Be(memberId);
            result.MemberName.Should().Be("Test Player");
            result.Matches.Should().Be(0);
            result.Innings.Should().Be(0);
            result.Runs.Should().Be(0);
            result.Average.Should().BeNull();
            result.StrikeRate.Should().BeNull();

            _memberRepoMock.Verify(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()), Times.Once);
            _battingRepoMock.Verify(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()), Times.Once);

            _bowlingRepoMock.VerifyNoOtherCalls();
            _seasonRepoMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetBattingStatsAsync_ShouldComputeBasicMetrics()
        {
            // ARRANGE
            const int memberId = 1;

            var member = new Member { Id = memberId, FullName = "Test Batter", IsDeleted = false };

            var scores = new List<BattingScore>
            {
                new()
                {
                    FixtureId = 10,
                    MemberId = memberId,
                    Runs = 40,
                    Balls = 30,
                    Fours = 6,
                    Sixes = 0,
                    IsOut = true
                },
                new()
                {
                    FixtureId = 11,
                    MemberId = memberId,
                    Runs = 60,
                    Balls = 50,
                    Fours = 5,
                    Sixes = 1,
                    IsOut = false
                },
                new()
                {
                    FixtureId = 12,
                    MemberId = memberId,
                    Runs = 10,
                    Balls = 8,
                    Fours = 1,
                    Sixes = 0,
                    IsOut = true
                }
            };
            // Totals:
            // Runs = 40 + 60 + 10 = 110
            // Balls = 30 + 50 + 8 = 88
            // Innings = 3
            // NotOuts = 1
            // Dismissals = 2
            // Average = 110 / 2 = 55.00
            // SR = (110 / 88) * 100 ≈ 125.00

            _memberRepoMock
                .Setup(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            _battingRepoMock
                .Setup(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(scores);

            // ACT
            var result = await _sut.GetBattingStatsAsync(memberId);

            // ASSERT
            result.MemberName.Should().Be("Test Batter");
            result.Innings.Should().Be(3);
            result.NotOuts.Should().Be(1);
            result.Runs.Should().Be(110);
            result.HighScore.Should().Be(60);
            result.BallsFaced.Should().Be(88);
            result.Fours.Should().Be(12); // 6+5+1
            result.Sixes.Should().Be(1);

            result.Average.Should().Be(55.00m);
            result.StrikeRate.Should().Be(125.00m);

            _memberRepoMock.Verify(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()), Times.Once);
            _battingRepoMock.Verify(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()), Times.Once);

            _bowlingRepoMock.VerifyNoOtherCalls();
            _seasonRepoMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetBowlingStatsAsync_ShouldReturnEmptyStats_WhenNoFigures()
        {
            // ARRANGE
            const int memberId = 2;

            var member = new Member { Id = memberId, FullName = "Test Bowler", IsDeleted = false };

            _memberRepoMock
                .Setup(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            _bowlingRepoMock
                .Setup(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(new List<BowlingFigure>());

            // ACT
            var result = await _sut.GetBowlingStatsAsync(memberId);

            // ASSERT
            result.MemberId.Should().Be(memberId);
            result.Matches.Should().Be(0);
            result.Wickets.Should().Be(0);
            result.Average.Should().BeNull();
            result.Economy.Should().BeNull();
            result.StrikeRate.Should().BeNull();
            result.BestFigures.Should().BeNull();

            _memberRepoMock.Verify(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()), Times.Once);
            _bowlingRepoMock.Verify(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()), Times.Once);

            _battingRepoMock.VerifyNoOtherCalls();
            _seasonRepoMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetBowlingStatsAsync_ShouldComputeBasicMetrics()
        {
            // ARRANGE
            const int memberId = 2;

            var member = new Member { Id = memberId, FullName = "Test Bowler", IsDeleted = false };

            var figures = new List<BowlingFigure>
            {
                new()
                {
                    FixtureId = 20,
                    MemberId = memberId,
                    Overs = 4.0m, // 24 balls
                    Maidens = 1,
                    RunsConceded = 20,
                    Wickets = 2
                },
                new()
                {
                    FixtureId = 21,
                    MemberId = memberId,
                    Overs = 3.2m, // 20 balls (3 overs + 2 balls)
                    Maidens = 0,
                    RunsConceded = 18,
                    Wickets = 3
                }
            };
            // Totals:
            // Balls = 24 + 20 = 44 balls ⇒ 7.2 overs
            // Runs = 38
            // Wickets = 5
            // Matches = 2
            // Average = 38 / 5 = 7.60
            // Economy = 38 / (44/6) = 38 / 7.333... ≈ 5.18
            // StrikeRate = 44 / 5 ≈ 8.80
            // Best figures = 3/18 (more wickets, fewer runs)

            _memberRepoMock
                .Setup(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()))
                .ReturnsAsync(member);

            _bowlingRepoMock
                .Setup(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(figures);

            // ACT
            var result = await _sut.GetBowlingStatsAsync(memberId);

            // ASSERT
            result.MemberName.Should().Be("Test Bowler");
            result.Matches.Should().Be(2);
            result.Overs.Should().Be(7.2m);
            result.Maidens.Should().Be(1);
            result.RunsConceded.Should().Be(38);
            result.Wickets.Should().Be(5);

            result.Average.Should().Be(7.60m);
            result.Economy.Should().Be(5.18m);
            result.StrikeRate.Should().Be(8.80m);
            result.BestFigures.Should().Be("3/18");

            _memberRepoMock.Verify(r => r.GetByIdAsync(memberId, It.IsAny<CancellationToken>()), Times.Once);
            _bowlingRepoMock.Verify(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()), Times.Once);

            _battingRepoMock.VerifyNoOtherCalls();
            _seasonRepoMock.VerifyNoOtherCalls();
        }

        [Fact]
        public async Task GetBattingLeaderboardAsync_ShouldOrderByRunsThenAverage_AndLimitTopN()
        {
            // ARRANGE
            var scores = new List<BattingScore>
            {
                // Player 1: 100 runs, avg 50
                new() { MemberId = 1, FixtureId = 10, Runs = 50, Balls = 40, IsOut = true },
                new() { MemberId = 1, FixtureId = 11, Runs = 50, Balls = 50, IsOut = true },

                // Player 2: 120 runs, avg 60
                new() { MemberId = 2, FixtureId = 12, Runs = 60, Balls = 50, IsOut = true },
                new() { MemberId = 2, FixtureId = 13, Runs = 60, Balls = 60, IsOut = true },

                // Player 3: 120 runs, avg 40 (3 innings, one not out)
                new() { MemberId = 3, FixtureId = 14, Runs = 40, Balls = 30, IsOut = true },
                new() { MemberId = 3, FixtureId = 15, Runs = 40, Balls = 30, IsOut = true },
                new() { MemberId = 3, FixtureId = 16, Runs = 40, Balls = 40, IsOut = false }
            };

            var members = new List<Member>
            {
                new() { Id = 1, FullName = "Player One", IsDeleted = false },
                new() { Id = 2, FullName = "Player Two", IsDeleted = false },
                new() { Id = 3, FullName = "Player Three", IsDeleted = false }
            };

            _battingRepoMock
                .Setup(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(scores);

            _memberRepoMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(members);

            // No season filter
            // ACT
            var leaderboard = await _sut.GetBattingLeaderboardAsync(null, topN: 2);

            // ASSERT
            leaderboard.Should().HaveCount(2);

            // Player 2 and Player 3 both have 120 runs.
            // Player 2 has higher average, so should come first.
            leaderboard[0].MemberId.Should().Be(2);
            leaderboard[1].MemberId.Should().Be(3);

            leaderboard[0].Rank.Should().Be(1);
            leaderboard[1].Rank.Should().Be(2);
        }

        [Fact]
        public async Task GetBowlingLeaderboardAsync_ShouldOrderByWicketsThenAverage_AndLimitTopN()
        {
            // ARRANGE
            var figures = new List<BowlingFigure>
            {
                // Player 1: 5 wickets, 40 runs
                new() { MemberId = 1, FixtureId = 10, Overs = 4.0m, RunsConceded = 20, Wickets = 2 },
                new() { MemberId = 1, FixtureId = 11, Overs = 4.0m, RunsConceded = 20, Wickets = 3 },

                // Player 2: 5 wickets, 30 runs (better average)
                new() { MemberId = 2, FixtureId = 12, Overs = 4.0m, RunsConceded = 15, Wickets = 3 },
                new() { MemberId = 2, FixtureId = 13, Overs = 4.0m, RunsConceded = 15, Wickets = 2 },

                // Player 3: 3 wickets, 10 runs – fewer wickets, should rank lower
                new() { MemberId = 3, FixtureId = 14, Overs = 4.0m, RunsConceded = 10, Wickets = 3 }
            };

            var members = new List<Member>
            {
                new() { Id = 1, FullName = "Bowler One", IsDeleted = false },
                new() { Id = 2, FullName = "Bowler Two", IsDeleted = false },
                new() { Id = 3, FullName = "Bowler Three", IsDeleted = false }
            };

            _bowlingRepoMock
                .Setup(r => r.GetForStatsAsync(null, It.IsAny<CancellationToken>()))
                .ReturnsAsync(figures);

            _memberRepoMock
                .Setup(r => r.GetAllAsync(It.IsAny<CancellationToken>()))
                .ReturnsAsync(members);

            // ACT
            var leaderboard = await _sut.GetBowlingLeaderboardAsync(null, topN: 2);

            // ASSERT
            leaderboard.Should().HaveCount(2);

            // Player 1 and 2 both have 5 wickets.
            // Player 2 has better average/economy => should be ranked higher.
            leaderboard[0].MemberId.Should().Be(2);
            leaderboard[1].MemberId.Should().Be(1);
        }
    }
}
