using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// DTO used when returning a fixture from the API.
    /// </summary>
    public class FixtureDto
    {
        public int Id { get; set; }

        public int SeasonId { get; set; }

        public int HomeTeamId { get; set; }

        public int AwayTeamId { get; set; }

        public DateTime StartDateTime { get; set; }

        public string Venue { get; set; } = string.Empty;

        public string CompetitionName { get; set; } = string.Empty;

        public string Status { get; set; } = "Scheduled";
    }
}
