import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  AuthApiResponse,
  UserInfo,
  AuthState,
  TokenPayload,
  ApiError
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  // Auth state using signals for reactive updates
  private authState = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: false,
    error: null
  });

  // Public readonly signals
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly currentUser = computed(() => this.authState().user);
  readonly isLoading = computed(() => this.authState().loading);
  readonly error = computed(() => this.authState().error);

  // BehaviorSubject for components that need Observable pattern
  private isAuthenticated$ = new BehaviorSubject<boolean>(false);

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize auth state from stored token on app startup
   */
  private initializeAuth(): void {
    const token = this.getStoredToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.getStoredUser();
      this.authState.set({
        isAuthenticated: true,
        user,
        token,
        loading: false,
        error: null
      });
      this.isAuthenticated$.next(true);
    } else {
      // Clear expired token
      this.clearStorage();
    }
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthApiResponse>(
      `${environment.identityApiUrl}/auth/login`,
      credentials
    ).pipe(
      map(apiResponse => this.transformApiResponse(apiResponse)),
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  /**
   * Register a new user
   */
  register(userData: RegisterRequest): Observable<AuthResponse> {
    this.setLoading(true);
    this.clearError();

    return this.http.post<AuthApiResponse>(
      `${environment.identityApiUrl}/auth/register`,
      userData
    ).pipe(
      map(apiResponse => this.transformApiResponse(apiResponse)),
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  /**
   * Transform API response to internal AuthResponse format
   */
  private transformApiResponse(apiResponse: AuthApiResponse): AuthResponse {
    // Decode JWT to extract roles and permissions
    const tokenPayload = this.decodeToken(apiResponse.accessToken);

    // Extract roles (can be string or array in JWT)
    let roles: string[] = [];
    if (tokenPayload?.role) {
      roles = Array.isArray(tokenPayload.role) ? tokenPayload.role : [tokenPayload.role];
    }

    // Extract permissions (can be string or array in JWT)
    let permissions: string[] = [];
    if (tokenPayload?.permission) {
      permissions = Array.isArray(tokenPayload.permission)
        ? tokenPayload.permission
        : [tokenPayload.permission];
    }

    return {
      accessToken: apiResponse.accessToken,
      refreshToken: apiResponse.refreshToken,
      expiresAt: apiResponse.expiresAtUtc,
      user: {
        id: apiResponse.userId,
        email: apiResponse.email,
        userName: apiResponse.userName,
        roles,
        permissions
      }
    };
  }

  /**
   * Logout - clear all auth data and redirect to login
   */
  logout(): void {
    this.clearStorage();
    this.authState.set({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null
    });
    this.isAuthenticated$.next(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Get the current access token
   */
  getToken(): string | null {
    return this.authState().token || this.getStoredToken();
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    return user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Check if user has all specified permissions
   */
  hasAllPermissions(permissions: string[]): boolean {
    return permissions.every(p => this.hasPermission(p));
  }

  /**
   * Get observable for auth state changes
   */
  getAuthState(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }

  /**
   * Handle successful authentication
   */
  private handleAuthSuccess(response: AuthResponse): void {
    // Store tokens
    this.storeToken(response.accessToken);
    if (response.refreshToken) {
      this.storeRefreshToken(response.refreshToken);
    }
    this.storeUser(response.user);

    // Update state
    this.authState.set({
      isAuthenticated: true,
      user: response.user,
      token: response.accessToken,
      loading: false,
      error: null
    });
    this.isAuthenticated$.next(true);
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(error: HttpErrorResponse): Observable<never> {
    this.setLoading(false);

    let errorMessage = 'An unexpected error occurred';

    if (error.error) {
      // Handle structured API error response
      if (typeof error.error === 'string') {
        errorMessage = error.error;
      } else if (error.error.message) {
        errorMessage = error.error.message;
      } else if (error.error.errors && Array.isArray(error.error.errors)) {
        errorMessage = error.error.errors.join(', ');
      }
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.status === 400) {
      errorMessage = 'Invalid request. Please check your input.';
    } else if (error.status === 429) {
      errorMessage = 'Too many attempts. Please try again later.';
    }

    this.authState.update(state => ({
      ...state,
      error: errorMessage,
      loading: false
    }));

    return throwError(() => ({ message: errorMessage, statusCode: error.status } as ApiError));
  }

  /**
   * Decode JWT token to get payload
   */
  decodeToken(token: string): TokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded) as TokenPayload;
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    const now = Date.now();
    return now >= expiryTime - environment.tokenExpiryBuffer;
  }

  /**
   * Check if token will expire soon (within buffer period)
   */
  isTokenExpiringSoon(token: string): boolean {
    const payload = this.decodeToken(token);
    if (!payload || !payload.exp) {
      return true;
    }
    const expiryTime = payload.exp * 1000;
    const bufferTime = environment.tokenExpiryBuffer;
    return Date.now() >= expiryTime - bufferTime * 2;
  }

  // Storage helpers
  private storeToken(token: string): void {
    localStorage.setItem(environment.tokenKey, token);
  }

  private storeRefreshToken(token: string): void {
    localStorage.setItem(environment.refreshTokenKey, token);
  }

  private storeUser(user: UserInfo): void {
    localStorage.setItem(environment.userKey, JSON.stringify(user));
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem(environment.refreshTokenKey);
  }

  private getStoredUser(): UserInfo | null {
    const userJson = localStorage.getItem(environment.userKey);
    if (userJson) {
      try {
        return JSON.parse(userJson) as UserInfo;
      } catch {
        return null;
      }
    }
    return null;
  }

  private clearStorage(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem(environment.refreshTokenKey);
    localStorage.removeItem(environment.userKey);
  }

  private setLoading(loading: boolean): void {
    this.authState.update(state => ({ ...state, loading }));
  }

  private clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }
}
