namespace FaziCricketClub.API.Models
{
    /// <summary>
    /// Standard wrapper for successful API responses.
    /// For non-success cases, prefer using ProblemDetails (RFC 7807).
    /// </summary>
    public class ApiResponse<T>
    {
        /// <summary>
        /// Indicates whether the operation was successful.
        /// </summary>
        public bool Success { get; init; }

        /// <summary>
        /// Optional human-readable message.
        /// </summary>
        public string? Message { get; init; }

        /// <summary>
        /// The response payload.
        /// </summary>
        public T? Data { get; init; }

        /// <summary>
        /// Optional list of errors, typically used only when Success is false.
        /// For high-level 4xx/5xx responses, we prefer ProblemDetails instead.
        /// </summary>
        public List<ApiError>? Errors { get; init; }

        public static ApiResponse<T> Ok(T data, string? message = null)
            => new ApiResponse<T>
            {
                Success = true,
                Data = data,
                Message = message,
                Errors = null
            };

        public static ApiResponse<T> Fail(string message, List<ApiError>? errors = null)
            => new ApiResponse<T>
            {
                Success = false,
                Data = default,
                Message = message,
                Errors = errors
            };
    }

    /// <summary>
    /// Represents a single error item that can be attached to an ApiResponse.
    /// </summary>
    public class ApiError
    {
        /// <summary>
        /// Optional error code, for programmatic use.
        /// </summary>
        public string? Code { get; init; }

        /// <summary>
        /// Human-readable error message.
        /// </summary>
        public string Message { get; init; } = string.Empty;

        /// <summary>
        /// Optional field name related to this error (e.g. for validation errors).
        /// </summary>
        public string? Field { get; init; }
    }
}
