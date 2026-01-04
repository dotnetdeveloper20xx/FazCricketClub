import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  AdminUser,
  AdminRole,
  Permission,
  AssignRoleRequest,
  RolePermissionRequest,
  LockUserRequest
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private baseUrl = environment.identityApiUrl;

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // =====================================================
  // User Management
  // =====================================================

  /**
   * Get all users with their roles
   */
  getUsers(): Observable<AdminUser[]> {
    this.setLoading(true);
    return this.http.get<AdminUser[]>(`${this.baseUrl}/admin/users`).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Assign a role to a user
   */
  assignRole(userId: string, request: AssignRoleRequest): Observable<void> {
    this.setLoading(true);
    return this.http.post<void>(`${this.baseUrl}/admin/users/${userId}/roles`, request).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Remove a role from a user
   */
  removeRole(userId: string, roleName: string): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(`${this.baseUrl}/admin/users/${userId}/roles/${roleName}`).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Lock a user account
   */
  lockUser(userId: string, request?: LockUserRequest): Observable<void> {
    this.setLoading(true);
    return this.http.post<void>(`${this.baseUrl}/admin/users/${userId}/lock`, request || {}).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Unlock a user account
   */
  unlockUser(userId: string): Observable<void> {
    this.setLoading(true);
    return this.http.post<void>(`${this.baseUrl}/admin/users/${userId}/unlock`, {}).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  // =====================================================
  // Role Management
  // =====================================================

  /**
   * Get all roles with their permissions
   */
  getRoles(): Observable<AdminRole[]> {
    this.setLoading(true);
    return this.http.get<AdminRole[]>(`${this.baseUrl}/admin/roles`).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Add a permission to a role
   */
  addPermissionToRole(roleName: string, request: RolePermissionRequest): Observable<void> {
    this.setLoading(true);
    return this.http.post<void>(`${this.baseUrl}/admin/roles/${roleName}/permissions`, request).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Remove a permission from a role
   */
  removePermissionFromRole(roleName: string, permission: string): Observable<void> {
    this.setLoading(true);
    return this.http.delete<void>(`${this.baseUrl}/admin/roles/${roleName}/permissions/${permission}`).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  // =====================================================
  // Permission Management
  // =====================================================

  /**
   * Get all available permissions
   */
  getPermissions(): Observable<Permission[]> {
    this.setLoading(true);
    return this.http.get<Permission[]>(`${this.baseUrl}/admin/permissions`).pipe(
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  private setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  private clearError(): void {
    this.error.set(null);
  }
}
