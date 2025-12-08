using FaziCricketClub.Application.Dtos;
using FaziCricketClub.Application.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Services
{
    /// <summary>
    /// Provides aggregated batting and bowling statistics for players,
    /// including per-player summaries and leaderboards.
    /// </summary>
    public class PlayerStatsService : IPlayerStatsService
    {
        private readonly IBattingScoreRepository _battingScoreRepository;
        private readonly IBowlingFigureRepository _bowlingFigureRepository;
        private readonly IMemberRepository _memberRepository;
        private readonly ISeasonRepository _seasonRepository;
        private readonly ILogger<PlayerStatsService> _logger;

        public PlayerStatsService(
            IBattingScoreRepository battingScoreRepository,
            IBowlingFigureRepository bowlingFigureRepository,
            IMemberRepository memberRepository,
            ISeasonRepository seasonRepository,
            ILogger<PlayerStatsService> logger)
        {
            _battingScoreRepository = battingScoreRepository;
            _bowlingFigureRepository = bowlingFigureRepository;
            _memberRepository = memberRepository;
            _seasonRepository = seasonRepository;
            _logger = logger;
        }

        // Methods implemented below...

        public async Task<PlayerBattingStatsDto> GetBattingStatsAsync(
    int memberId,
    int? seasonId = null,
    CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "Calculating batting stats for MemberId={MemberId}, SeasonId={SeasonId}",
                memberId, seasonId);

            var member = await _memberRepository.GetByIdAsync(memberId, cancellationToken);
            if (member is null || member.IsDeleted)
            {
                throw new KeyNotFoundException($"Member {memberId} was not found.");
            }

            var seasonName = default(string);
            if (seasonId.HasValue)
            {
                var season = await _seasonRepository.GetByIdAsync(seasonId.Value, cancellationToken);
                seasonName = season?.Name;
            }

            // Load batting scores for the relevant season (or all seasons if seasonId is null)
            var allScoresForSeason = await _battingScoreRepository
                .GetForStatsAsync(seasonId, cancellationToken);

            var playerScores = allScoresForSeason
                .Where(x => x.MemberId == memberId)
                .ToList();

            if (!playerScores.Any())
            {
                // Return an "empty" stats object rather than throwing
                return new PlayerBattingStatsDto
                {
                    MemberId = memberId,
                    MemberName = member.FullName,
                    SeasonId = seasonId,
                    SeasonName = seasonName,
                    Matches = 0,
                    Innings = 0,
                    NotOuts = 0,
                    Runs = 0,
                    HighScore = 0,
                    Average = null,
                    StrikeRate = null,
                    BallsFaced = 0,
                    Fours = 0,
                    Sixes = 0,
                    Fifties = 0,
                    Hundreds = 0
                };
            }

            var matches = playerScores
                .Select(s => s.FixtureId)
                .Distinct()
                .Count();

            var innings = playerScores.Count;
            var notOuts = playerScores.Count(s => !s.IsOut);
            var runs = playerScores.Sum(s => s.Runs);
            var balls = playerScores.Sum(s => s.Balls);
            var highScore = playerScores.Max(s => s.Runs);
            var fours = playerScores.Sum(s => s.Fours);
            var sixes = playerScores.Sum(s => s.Sixes);

            var dismissals = innings - notOuts;
            var average = SafeDivide(runs, dismissals);
            var strikeRate = balls == 0 ? null : SafeDivide(runs * 100, balls);

            var fifties = playerScores.Count(s => s.Runs >= 50 && s.Runs < 100);
            var hundreds = playerScores.Count(s => s.Runs >= 100);

            return new PlayerBattingStatsDto
            {
                MemberId = memberId,
                MemberName = member.FullName,
                SeasonId = seasonId,
                SeasonName = seasonName,
                Matches = matches,
                Innings = innings,
                NotOuts = notOuts,
                Runs = runs,
                HighScore = highScore,
                Average = average,
                StrikeRate = strikeRate,
                BallsFaced = balls,
                Fours = fours,
                Sixes = sixes,
                Fifties = fifties,
                Hundreds = hundreds
            };
        }

        public async Task<PlayerBowlingStatsDto> GetBowlingStatsAsync(
    int memberId,
    int? seasonId = null,
    CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "Calculating bowling stats for MemberId={MemberId}, SeasonId={SeasonId}",
                memberId, seasonId);

            var member = await _memberRepository.GetByIdAsync(memberId, cancellationToken);
            if (member is null || member.IsDeleted)
            {
                throw new KeyNotFoundException($"Member {memberId} was not found.");
            }

            var seasonName = default(string);
            if (seasonId.HasValue)
            {
                var season = await _seasonRepository.GetByIdAsync(seasonId.Value, cancellationToken);
                seasonName = season?.Name;
            }

            var allFiguresForSeason = await _bowlingFigureRepository
                .GetForStatsAsync(seasonId, cancellationToken);

            var playerFigures = allFiguresForSeason
                .Where(x => x.MemberId == memberId)
                .ToList();

            if (!playerFigures.Any())
            {
                return new PlayerBowlingStatsDto
                {
                    MemberId = memberId,
                    MemberName = member.FullName,
                    SeasonId = seasonId,
                    SeasonName = seasonName,
                    Matches = 0,
                    Overs = 0,
                    Maidens = 0,
                    RunsConceded = 0,
                    Wickets = 0,
                    Average = null,
                    Economy = null,
                    StrikeRate = null,
                    BestFigures = null,
                    FourWicketHauls = 0,
                    FiveWicketHauls = 0
                };
            }

            var matches = playerFigures
                .Select(f => f.FixtureId)
                .Distinct()
                .Count();

            var totalBalls = playerFigures.Sum(f => OversToBalls(f.Overs));
            var oversDecimal = BallsToOversDecimal(totalBalls);

            var maidens = playerFigures.Sum(f => f.Maidens);
            var runsConceded = playerFigures.Sum(f => f.RunsConceded);
            var wickets = playerFigures.Sum(f => f.Wickets);

            var average = wickets == 0 ? null : SafeDivide(runsConceded, wickets);

            decimal? economy = null;
            if (totalBalls > 0)
            {
                var oversAsFraction = (decimal)totalBalls / 6m;
                economy = SafeDivide(runsConceded, oversAsFraction);
            }

            decimal? strikeRate = null;
            if (wickets > 0 && totalBalls > 0)
            {
                strikeRate = SafeDivide(totalBalls, wickets);
            }

            // Best figures: sort by wickets desc, then runs asc.
            var bestInnings = playerFigures
                .OrderByDescending(f => f.Wickets)
                .ThenBy(f => f.RunsConceded)
                .First();

            var bestFigures = $"{bestInnings.Wickets}/{bestInnings.RunsConceded}";

            var fourWicketHauls = playerFigures.Count(f => f.Wickets == 4);
            var fiveWicketHauls = playerFigures.Count(f => f.Wickets >= 5);

            return new PlayerBowlingStatsDto
            {
                MemberId = memberId,
                MemberName = member.FullName,
                SeasonId = seasonId,
                SeasonName = seasonName,
                Matches = matches,
                Overs = oversDecimal,
                Maidens = maidens,
                RunsConceded = runsConceded,
                Wickets = wickets,
                Average = average,
                Economy = economy,
                StrikeRate = strikeRate,
                BestFigures = bestFigures,
                FourWicketHauls = fourWicketHauls,
                FiveWicketHauls = fiveWicketHauls
            };
        }

        public async Task<List<PlayerBattingLeaderboardEntryDto>> GetBattingLeaderboardAsync(
    int? seasonId = null,
    int topN = 10,
    CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "Calculating batting leaderboard for SeasonId={SeasonId}, TopN={TopN}",
                seasonId, topN);

            if (topN <= 0) topN = 10;

            var battingScores = await _battingScoreRepository
                .GetForStatsAsync(seasonId, cancellationToken);

            if (!battingScores.Any())
            {
                return new List<PlayerBattingLeaderboardEntryDto>();
            }

            var members = await _memberRepository.GetAllAsync(cancellationToken);
            var memberLookup = members
                .Where(m => !m.IsDeleted)
                .ToDictionary(m => m.Id, m => m.FullName);

            string? seasonName = null;
            if (seasonId.HasValue)
            {
                var season = await _seasonRepository.GetByIdAsync(seasonId.Value, cancellationToken);
                seasonName = season?.Name;
            }

            var grouped = battingScores
                .GroupBy(s => s.MemberId)
                .Select(g =>
                {
                    var innings = g.Count();
                    var notOuts = g.Count(x => !x.IsOut);
                    var runs = g.Sum(x => x.Runs);
                    var balls = g.Sum(x => x.Balls);
                    var dismissals = innings - notOuts;

                    var average = SafeDivide(runs, dismissals);
                    var strikeRate = balls == 0 ? null : SafeDivide(runs * 100, balls);
                    var highScore = g.Max(x => x.Runs);

                    var fifties = g.Count(x => x.Runs >= 50 && x.Runs < 100);
                    var hundreds = g.Count(x => x.Runs >= 100);

                    return new
                    {
                        MemberId = g.Key,
                        Innings = innings,
                        Runs = runs,
                        Average = average,
                        StrikeRate = strikeRate,
                        HighScore = highScore,
                        Fifties = fifties,
                        Hundreds = hundreds,
                        Matches = g.Select(x => x.FixtureId).Distinct().Count()
                    };
                })
                .Where(x => x.Innings > 0) // optional threshold
                .ToList();

            // Order primarily by runs desc, then average desc, then strike rate desc.
            var ordered = grouped
                .OrderByDescending(x => x.Runs)
                .ThenByDescending(x => x.Average ?? 0)
                .ThenByDescending(x => x.StrikeRate ?? 0)
                .Take(topN)
                .ToList();

            var result = new List<PlayerBattingLeaderboardEntryDto>();
            var rank = 1;

            foreach (var row in ordered)
            {
                memberLookup.TryGetValue(row.MemberId, out var name);

                result.Add(new PlayerBattingLeaderboardEntryDto
                {
                    Rank = rank++,
                    MemberId = row.MemberId,
                    MemberName = name ?? $"Player {row.MemberId}",
                    SeasonId = seasonId,
                    SeasonName = seasonName,
                    Matches = row.Matches,
                    Innings = row.Innings,
                    Runs = row.Runs,
                    Average = row.Average,
                    StrikeRate = row.StrikeRate,
                    HighScore = row.HighScore,
                    Fifties = row.Fifties,
                    Hundreds = row.Hundreds
                });
            }

            return result;
        }


        public async Task<List<PlayerBowlingLeaderboardEntryDto>> GetBowlingLeaderboardAsync(
    int? seasonId = null,
    int topN = 10,
    CancellationToken cancellationToken = default)
        {
            _logger.LogInformation(
                "Calculating bowling leaderboard for SeasonId={SeasonId}, TopN={TopN}",
                seasonId, topN);

            if (topN <= 0) topN = 10;

            var figures = await _bowlingFigureRepository
                .GetForStatsAsync(seasonId, cancellationToken);

            if (!figures.Any())
            {
                return new List<PlayerBowlingLeaderboardEntryDto>();
            }

            var members = await _memberRepository.GetAllAsync(cancellationToken);
            var memberLookup = members
                .Where(m => !m.IsDeleted)
                .ToDictionary(m => m.Id, m => m.FullName);

            string? seasonName = null;
            if (seasonId.HasValue)
            {
                var season = await _seasonRepository.GetByIdAsync(seasonId.Value, cancellationToken);
                seasonName = season?.Name;
            }

            var grouped = figures
                .GroupBy(f => f.MemberId)
                .Select(g =>
                {
                    var totalBalls = g.Sum(x => OversToBalls(x.Overs));
                    var oversDecimal = BallsToOversDecimal(totalBalls);

                    var runsConceded = g.Sum(x => x.RunsConceded);
                    var wickets = g.Sum(x => x.Wickets);

                    decimal? average = wickets == 0 ? null : SafeDivide(runsConceded, wickets);

                    decimal? economy = null;
                    if (totalBalls > 0)
                    {
                        var oversAsFraction = (decimal)totalBalls / 6m;
                        economy = SafeDivide(runsConceded, oversAsFraction);
                    }

                    decimal? strikeRate = null;
                    if (wickets > 0 && totalBalls > 0)
                    {
                        strikeRate = SafeDivide(totalBalls, wickets);
                    }

                    var best = g
                        .OrderByDescending(x => x.Wickets)
                        .ThenBy(x => x.RunsConceded)
                        .First();

                    var bestFigures = $"{best.Wickets}/{best.RunsConceded}";

                    var fourWicketHauls = g.Count(x => x.Wickets == 4);
                    var fiveWicketHauls = g.Count(x => x.Wickets >= 5);

                    return new
                    {
                        MemberId = g.Key,
                        Matches = g.Select(x => x.FixtureId).Distinct().Count(),
                        OversDecimal = oversDecimal,
                        RunsConceded = runsConceded,
                        Wickets = wickets,
                        Average = average,
                        Economy = economy,
                        StrikeRate = strikeRate,
                        BestFigures = bestFigures,
                        FourWicketHauls = fourWicketHauls,
                        FiveWicketHauls = fiveWicketHauls
                    };
                })
                .Where(x => x.Wickets > 0) // optional: only bowlers who took at least 1 wicket
                .ToList();

            // Order primarily by wickets desc, then average asc, then economy asc.
            var ordered = grouped
                .OrderByDescending(x => x.Wickets)
                .ThenBy(x => x.Average ?? decimal.MaxValue)
                .ThenBy(x => x.Economy ?? decimal.MaxValue)
                .Take(topN)
                .ToList();

            var result = new List<PlayerBowlingLeaderboardEntryDto>();
            var rank = 1;

            foreach (var row in ordered)
            {
                memberLookup.TryGetValue(row.MemberId, out var name);

                result.Add(new PlayerBowlingLeaderboardEntryDto
                {
                    Rank = rank++,
                    MemberId = row.MemberId,
                    MemberName = name ?? $"Player {row.MemberId}",
                    SeasonId = seasonId,
                    SeasonName = seasonName,
                    Matches = row.Matches,
                    Overs = row.OversDecimal,
                    RunsConceded = row.RunsConceded,
                    Wickets = row.Wickets,
                    Average = row.Average,
                    Economy = row.Economy,
                    StrikeRate = row.StrikeRate,
                    BestFigures = row.BestFigures
                });
            }

            return result;
        }





        // --- Helper: safely divide decimals, returning null on division by zero ---

        private static decimal? SafeDivide(decimal numerator, decimal denominator)
        {
            if (denominator == 0) return null;
            return decimal.Round(numerator / denominator, 2, MidpointRounding.AwayFromZero);
        }

        private static decimal? SafeDivide(int numerator, int denominator)
        {
            if (denominator == 0) return null;
            return decimal.Round((decimal)numerator / denominator, 2, MidpointRounding.AwayFromZero);
        }

        // --- Helpers: convert cricket overs (e.g. 4.2) to balls and back ---

        private static int OversToBalls(decimal overs)
        {
            var wholeOvers = (int)decimal.Truncate(overs);
            var fraction = overs - wholeOvers;
            // fraction is expected like 0.0, 0.1, ..., 0.5
            var balls = (int)Math.Round(fraction * 10M, MidpointRounding.AwayFromZero);

            if (balls < 0) balls = 0;
            if (balls > 5) balls = 5; // guard against invalid data like 0.6

            return wholeOvers * 6 + balls;
        }

        private static decimal BallsToOversDecimal(int totalBalls)
        {
            if (totalBalls <= 0) return 0m;

            var wholeOvers = totalBalls / 6;
            var remainingBalls = totalBalls % 6;

            return wholeOvers + remainingBalls / 10m;
        }

    }
}
