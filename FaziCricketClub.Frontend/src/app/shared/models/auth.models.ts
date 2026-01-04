// =====================================================
// Authentication Models
// =====================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

// Response from the Identity API (flat structure)
export interface AuthApiResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAtUtc: string;
  userId: string;
  userName: string;
  email: string;
}

// Internal auth response with user object (used by AuthService)
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  expiresAt: string;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
  permissions: string[];
}

export interface TokenPayload {
  sub: string;
  jti?: string;
  nameid?: string;
  unique_name?: string;
  email: string;
  name?: string;
  role: string | string[];
  permission?: string | string[];  // API uses 'permission' not 'permissions'
  permissions?: string[];
  exp: number;
  iat: number;
  nbf: number;
  iss?: string;
  aud?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// API Response wrapper (matches backend ApiResponse<T>)
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

// Error response from API
export interface ApiError {
  message: string;
  errors?: string[];
  statusCode?: number;
}
