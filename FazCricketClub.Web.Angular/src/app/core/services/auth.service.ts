import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, AuthResponse, UserInfo } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'fazcc_token';
  private readonly USER_KEY = 'fazcc_user';

  // Signal for reactive state management
  private currentUserSubject = new BehaviorSubject<UserInfo | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  /**
   * Register a new user
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.identityApiUrl}/auth/register`,
      request
    ).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Login user
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.identityApiUrl}/auth/login`,
      request
    ).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  /**
   * Get current user information from API
   */
  me(): Observable<UserInfo> {
    return this.http.get<UserInfo>(
      `${environment.identityApiUrl}/auth/me`
    ).pipe(
      tap(userInfo => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
        this.currentUserSubject.next(userInfo);
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      return Date.now() < exp;
    } catch {
      return false;
    }
  }

  /**
   * Get current user value
   */
  getCurrentUser(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user?.permissions?.includes(permission) ?? false;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) ?? false;
  }

  /**
   * Handle authentication response
   */
  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.accessToken);

    // Fetch full user info including roles and permissions
    this.me().subscribe();
  }

  /**
   * Get user from local storage
   */
  private getUserFromStorage(): UserInfo | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  }
}
