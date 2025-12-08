using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Parameters for querying fixture activity over time.
    /// </summary>
    public class FixtureActivityFilterParameters
    {
        /// <summary>
        /// Optional start date for the period. Defaults to 12 months before 'to'.
        /// </summary>
        public DateTime? From { get; set; }

        /// <summary>
        /// Optional end date for the period. Defaults to now.
        /// </summary>
        public DateTime? To { get; set; }

        /// <summary>
        /// Optional season filter.
        /// </summary>
        public int? SeasonId { get; set; }

        /// <summary>
        /// Optional team filter (either as home or away).
        /// </summary>
        public int? TeamId { get; set; }
    }
}
