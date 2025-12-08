using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// High-level statistics about the club for dashboard views.
    /// </summary>
    public class ClubStatsDto
    {
        // Members
        public int TotalMembers { get; set; }
        public int ActiveMembers { get; set; }
        public int InactiveMembers { get; set; }

        // Fixtures
        public int TotalFixtures { get; set; }
        public int ScheduledFixtures { get; set; }
        public int CompletedFixtures { get; set; }
    }
}
