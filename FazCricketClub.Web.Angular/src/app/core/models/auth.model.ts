// Authentication models matching your IdentityApi DTOs

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  userName?: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: Date;
  userId: string;
  userName: string;
  email: string;
}

export interface UserInfo {
  userId: string;
  userName: string;
  email: string;
  roles: string[];
  permissions: string[];
}
