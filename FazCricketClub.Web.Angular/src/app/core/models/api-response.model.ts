// Generic API Response wrapper matching your .NET ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: ApiError[];
}

export interface ApiError {
  field?: string;
  message: string;
}

// Pagination models
export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
