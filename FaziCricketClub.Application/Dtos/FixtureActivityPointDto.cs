using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents aggregated fixture activity for a specific month.
    /// Intended for plotting time series charts (e.g., line/bar).
    /// </summary>
    public class FixtureActivityPointDto
    {
        /// <summary>
        /// Calendar year of this point, e.g. 2025.
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// Calendar month (1-12) of this point.
        /// </summary>
        public int Month { get; set; }

        /// <summary>
        /// The first day of the month, for convenience in charting.
        /// </summary>
        public DateTime MonthStartDate => new DateTime(Year, Month, 1);

        /// <summary>
        /// Total fixtures in this month after filtering.
        /// </summary>
        public int TotalFixtures { get; set; }

        /// <summary>
        /// Fixtures with status 'Scheduled' (or similar) in this month.
        /// </summary>
        public int ScheduledFixtures { get; set; }

        /// <summary>
        /// Fixtures with status 'Completed' in this month.
        /// </summary>
        public int CompletedFixtures { get; set; }

        /// <summary>
        /// Fixtures that do not fall into Scheduled/Completed.
        /// </summary>
        public int OtherFixtures { get; set; }
    }
}
