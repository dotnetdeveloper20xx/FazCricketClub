namespace FaziCricketClub.Application.Dtos
{
    /// <summary>
    /// Represents a page of data with metadata about paging.
    /// </summary>
    /// <typeparam name="T">The type of items in the page.</typeparam>
    public class PagedResult<T>
    {
        /// <summary>
        /// The items in the current page.
        /// </summary>
        public IReadOnlyList<T> Items { get; init; } = Array.Empty<T>();

        /// <summary>
        /// The total number of items across all pages (for the given filter).
        /// </summary>
        public int TotalCount { get; init; }

        /// <summary>
        /// The current page number (1-based).
        /// </summary>
        public int PageNumber { get; init; }

        /// <summary>
        /// The size of the page (number of items per page).
        /// </summary>
        public int PageSize { get; init; }

        /// <summary>
        /// The total number of pages.
        /// </summary>
        public int TotalPages =>
            PageSize == 0 ? 0 : (int)Math.Ceiling(TotalCount / (double)PageSize);

        /// <summary>
        /// Whether there is a previous page.
        /// </summary>
        public bool HasPrevious => PageNumber > 1;

        /// <summary>
        /// Whether there is a next page.
        /// </summary>
        public bool HasNext => PageNumber < TotalPages;

        public static PagedResult<T> Empty(int pageNumber, int pageSize)
            => new()
            {
                Items = Array.Empty<T>(),
                TotalCount = 0,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
    }
}
