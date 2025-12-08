using System;
using System.Collections.Generic;
using System.Text;

namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Parameters for filtering, sorting, and paging member lists.
    /// </summary>
    public class MemberFilterParameters
    {
        /// <summary>
        /// 1-based page number.
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// Page size (items per page).
        /// </summary>
        public int PageSize { get; set; } = 20;

        /// <summary>
        /// Optional filter: only active or inactive members.
        /// </summary>
        public bool? IsActive { get; set; }

        /// <summary>
        /// Optional search across name and email.
        /// </summary>
        public string? Search { get; set; }

        /// <summary>
        /// Sort field: "name" (default) or "email".
        /// </summary>
        public string? SortBy { get; set; } = "name";

        /// <summary>
        /// Sort direction: "asc" or "desc".
        /// </summary>
        public string? SortDirection { get; set; } = "asc";
    }
}
