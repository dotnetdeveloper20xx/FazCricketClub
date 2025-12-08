using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Parameters for querying member activity over time.
    /// </summary>
    public class MemberActivityFilterParameters
    {
        public DateTime? From { get; set; }

        public DateTime? To { get; set; }

        /// <summary>
        /// Optional status filter: true = only active, false = only inactive, null = all.
        /// </summary>
        public bool? IsActive { get; set; }
    }
}
