using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using FaziCricketClub.Domain.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Handles creation, updating, retrieval and deletion of match results
    /// and their associated scorecards.
    /// </summary>
    public class MatchResultService : IMatchResultService
    {
        private readonly IFixtureRepository _fixtureRepository;
        private readonly IMatchResultRepository _matchResultRepository;
        private readonly IBattingScoreRepository _battingScoreRepository;
        private readonly IBowlingFigureRepository _bowlingFigureRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<MatchResultService> _logger;

        public MatchResultService(
            IFixtureRepository fixtureRepository,
            IMatchResultRepository matchResultRepository,
            IBattingScoreRepository battingScoreRepository,
            IBowlingFigureRepository bowlingFigureRepository,
            IUnitOfWork unitOfWork,
            ILogger<MatchResultService> logger)
        {
            _fixtureRepository = fixtureRepository;
            _matchResultRepository = matchResultRepository;
            _battingScoreRepository = battingScoreRepository;
            _bowlingFigureRepository = bowlingFigureRepository;
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        public async Task<MatchResultDetailDto?> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Fetching match result for FixtureId={FixtureId}", fixtureId);

            var matchResult = await _matchResultRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            if (matchResult is null)
            {
                _logger.LogInformation("No match result found for FixtureId={FixtureId}", fixtureId);
                return null;
            }

            var battingScores = await _battingScoreRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            var bowlingFigures = await _bowlingFigureRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            return MapToDetailDto(matchResult, battingScores, bowlingFigures);
        }

        public async Task<MatchResultDetailDto> UpsertMatchResultAsync(
            int fixtureId,
            MatchResultUpsertDto request,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Upserting match result for FixtureId={FixtureId}", fixtureId);

            // 1. Ensure fixture exists and is not soft-deleted
            var fixture = await _fixtureRepository.GetByIdAsync(fixtureId, cancellationToken);
            if (fixture is null || fixture.IsDeleted)
            {
                _logger.LogWarning("Fixture not found or deleted. FixtureId={FixtureId}", fixtureId);
                throw new KeyNotFoundException($"Fixture {fixtureId} was not found.");
            }

            // 2. Load existing match result (if any)
            var existingResult = await _matchResultRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            MatchResult resultEntity;
            var isNew = existingResult is null;

            if (isNew)
            {
                resultEntity = new MatchResult
                {
                    FixtureId = fixtureId
                };

                await _matchResultRepository.AddAsync(resultEntity, cancellationToken);
            }
            else
            {
                resultEntity = existingResult!;
            }

            // 3. Map request onto result entity
            resultEntity.HomeTeamRuns = request.HomeTeamRuns;
            resultEntity.HomeTeamWickets = request.HomeTeamWickets;
            resultEntity.HomeTeamOvers = request.HomeTeamOvers;
            resultEntity.AwayTeamRuns = request.AwayTeamRuns;
            resultEntity.AwayTeamWickets = request.AwayTeamWickets;
            resultEntity.AwayTeamOvers = request.AwayTeamOvers;
            resultEntity.ResultSummary = request.ResultSummary;
            resultEntity.WinningTeamId = request.WinningTeamId;
            resultEntity.PlayerOfTheMatchMemberId = request.PlayerOfTheMatchMemberId;
            resultEntity.Notes = request.Notes;

            if (!isNew)
            {
                _matchResultRepository.Update(resultEntity);
            }

            // 4. Replace batting & bowling scorecards for this fixture
            var existingBatting = await _battingScoreRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            if (existingBatting.Any())
            {
                _battingScoreRepository.RemoveRange(existingBatting);
            }

            var existingBowling = await _bowlingFigureRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            if (existingBowling.Any())
            {
                _bowlingFigureRepository.RemoveRange(existingBowling);
            }

            var battingEntities = request.BattingScores.Select(dto => new BattingScore
            {
                FixtureId = fixtureId,
                TeamId = dto.TeamId,
                MemberId = dto.MemberId,
                BattingOrder = dto.BattingOrder,
                Runs = dto.Runs,
                Balls = dto.Balls,
                Fours = dto.Fours,
                Sixes = dto.Sixes,
                IsOut = dto.IsOut,
                DismissalType = dto.DismissalType,
                DismissalBowlerMemberId = dto.DismissalBowlerMemberId,
                DismissalFielderMemberId = dto.DismissalFielderMemberId,
                Notes = dto.Notes
            }).ToList();

            if (battingEntities.Any())
            {
                await _battingScoreRepository.AddRangeAsync(battingEntities, cancellationToken);
            }

            var bowlingEntities = request.BowlingFigures.Select(dto => new BowlingFigure
            {
                FixtureId = fixtureId,
                TeamId = dto.TeamId,
                MemberId = dto.MemberId,
                Overs = dto.Overs,
                Maidens = dto.Maidens,
                RunsConceded = dto.RunsConceded,
                Wickets = dto.Wickets,
                NoBalls = dto.NoBalls,
                Wides = dto.Wides,
                Notes = dto.Notes
            }).ToList();

            if (bowlingEntities.Any())
            {
                await _bowlingFigureRepository.AddRangeAsync(bowlingEntities, cancellationToken);
            }

            // 5. Mark fixture as completed
            fixture.Status = "Completed";
            _fixtureRepository.Update(fixture);

            // 6. Persist everything in one unit of work
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Reload fresh state to return detail DTO (ids, etc.)
            var reloadedResult = await _matchResultRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken)
                ?? resultEntity;

            var reloadedBatting = await _battingScoreRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            var reloadedBowling = await _bowlingFigureRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            return MapToDetailDto(reloadedResult, reloadedBatting, reloadedBowling);
        }

        public async Task DeleteMatchResultAsync(
            int fixtureId,
            CancellationToken cancellationToken = default)
        {
            _logger.LogInformation("Deleting match result for FixtureId={FixtureId}", fixtureId);

            var matchResult = await _matchResultRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            if (matchResult is null)
            {
                _logger.LogInformation("No match result to delete for FixtureId={FixtureId}", fixtureId);
                return;
            }

            var battingScores = await _battingScoreRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            var bowlingFigures = await _bowlingFigureRepository
                .GetByFixtureIdAsync(fixtureId, cancellationToken);

            if (battingScores.Any())
            {
                _battingScoreRepository.RemoveRange(battingScores);
            }

            if (bowlingFigures.Any())
            {
                _bowlingFigureRepository.RemoveRange(bowlingFigures);
            }

            _matchResultRepository.Remove(matchResult);

            // Optionally: reset fixture status if needed
            var fixture = await _fixtureRepository.GetByIdAsync(fixtureId, cancellationToken);
            if (fixture is not null && !fixture.IsDeleted)
            {
                // You can choose a default status; e.g. "Scheduled" or "PendingResult"
                if (string.Equals(fixture.Status, "Completed", StringComparison.OrdinalIgnoreCase))
                {
                    fixture.Status = "Scheduled";
                    _fixtureRepository.Update(fixture);
                }
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        private static MatchResultDetailDto MapToDetailDto(
            MatchResult result,
            IEnumerable<BattingScore> battingScores,
            IEnumerable<BowlingFigure> bowlingFigures)
        {
            var dto = new MatchResultDetailDto
            {
                FixtureId = result.FixtureId,
                MatchResultId = result.Id,
                HomeTeamRuns = result.HomeTeamRuns,
                HomeTeamWickets = result.HomeTeamWickets,
                HomeTeamOvers = result.HomeTeamOvers,
                AwayTeamRuns = result.AwayTeamRuns,
                AwayTeamWickets = result.AwayTeamWickets,
                AwayTeamOvers = result.AwayTeamOvers,
                ResultSummary = result.ResultSummary,
                WinningTeamId = result.WinningTeamId,
                PlayerOfTheMatchMemberId = result.PlayerOfTheMatchMemberId,
                Notes = result.Notes,
                BattingScores = battingScores.Select(b => new BattingScoreDto
                {
                    TeamId = b.TeamId,
                    MemberId = b.MemberId,
                    BattingOrder = b.BattingOrder,
                    Runs = b.Runs,
                    Balls = b.Balls,
                    Fours = b.Fours,
                    Sixes = b.Sixes,
                    IsOut = b.IsOut,
                    DismissalType = b.DismissalType,
                    DismissalBowlerMemberId = b.DismissalBowlerMemberId,
                    DismissalFielderMemberId = b.DismissalFielderMemberId,
                    Notes = b.Notes
                }).OrderBy(x => x.TeamId).ThenBy(x => x.BattingOrder).ToList(),
                BowlingFigures = bowlingFigures.Select(b => new BowlingFigureDto
                {
                    TeamId = b.TeamId,
                    MemberId = b.MemberId,
                    Overs = b.Overs,
                    Maidens = b.Maidens,
                    RunsConceded = b.RunsConceded,
                    Wickets = b.Wickets,
                    NoBalls = b.NoBalls,
                    Wides = b.Wides,
                    Notes = b.Notes
                }).OrderBy(x => x.TeamId).ThenByDescending(x => x.Wickets).ToList()
            };

            return dto;
        }
    }
}
