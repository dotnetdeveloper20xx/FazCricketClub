namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Parameters for filtering, sorting, and paging fixture lists.
    /// These will typically be bound from query string in the controller.
    /// </summary>
    public class FixtureFilterParameters
    {
        /// <summary>
        /// 1-based page number. Defaults will be applied in the controller/service.
        /// </summary>
        public int Page { get; set; } = 1;

        /// <summary>
        /// Page size (number of items per page).
        /// </summary>
        public int PageSize { get; set; } = 20;

        /// <summary>
        /// Optional filter: only fixtures in this season.
        /// </summary>
        public int? SeasonId { get; set; }

        /// <summary>
        /// Optional filter: fixtures where either home or away team matches this id.
        /// </summary>
        public int? TeamId { get; set; }

        /// <summary>
        /// Optional filter: fixtures starting on or after this date/time (UTC or local, your choice).
        /// </summary>
        public DateTime? FromDate { get; set; }

        /// <summary>
        /// Optional filter: fixtures starting on or before this date/time.
        /// </summary>
        public DateTime? ToDate { get; set; }

        /// <summary>
        /// Field to sort by (e.g. "date", "competition", "status").
        /// We will interpret it in the service.
        /// </summary>
        public string? SortBy { get; set; } = "date";

        /// <summary>
        /// Sort direction: "asc" or "desc".
        /// </summary>
        public string? SortDirection { get; set; } = "asc";
    }
}
