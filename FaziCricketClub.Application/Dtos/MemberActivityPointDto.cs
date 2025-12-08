using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents aggregated member activity for a specific month,
    /// typically based on join date for sign-up charts.
    /// </summary>
    public class MemberActivityPointDto
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
        /// First day of the month, useful for charting on a time axis.
        /// </summary>
        public DateTime MonthStartDate => new DateTime(Year, Month, 1);

        /// <summary>
        /// Number of members who joined in this month (after filters).
        /// </summary>
        public int JoinedCount { get; set; }

        /// <summary>
        /// Number of members currently active that joined in this month.
        /// </summary>
        public int ActiveJoinedCount { get; set; }

        /// <summary>
        /// Number of members currently inactive that joined in this month.
        /// </summary>
        public int InactiveJoinedCount { get; set; }
    }
}
