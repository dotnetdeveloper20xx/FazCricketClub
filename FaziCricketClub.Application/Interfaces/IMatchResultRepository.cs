using FaziCricketClub.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Interfaces
{
    /// <summary>
    /// Repository for accessing match result aggregates.
    /// </summary>
    public interface IMatchResultRepository
    {
        Task<MatchResult?> GetByFixtureIdAsync(
            int fixtureId,
            CancellationToken cancellationToken = default);

        Task AddAsync(
            MatchResult entity,
            CancellationToken cancellationToken = default);

        void Update(MatchResult entity);

        void Remove(MatchResult entity);
    }
}
