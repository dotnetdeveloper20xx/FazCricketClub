import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Member,
  CreateMemberRequest,
  UpdateMemberRequest
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/members`;

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get paginated list of members
   */
  getMembers(params?: PaginationParams): Observable<PaginatedResponse<Member>> {
    this.setLoading(true);

    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDescending !== undefined) httpParams = httpParams.set('sortDescending', params.sortDescending.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Member>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get all members (non-paginated)
   */
  getAllMembers(): Observable<Member[]> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Member[]>>(`${this.baseUrl}/all`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get single member by ID
   */
  getMember(id: string): Observable<Member> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Member>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Create new member
   */
  createMember(member: CreateMemberRequest): Observable<Member> {
    this.setLoading(true);
    return this.http.post<ApiResponse<Member>>(this.baseUrl, member).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Update existing member
   */
  updateMember(id: string, member: UpdateMemberRequest): Observable<Member> {
    this.setLoading(true);
    return this.http.put<ApiResponse<Member>>(`${this.baseUrl}/${id}`, member).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Delete member (soft delete)
   */
  deleteMember(id: string): Observable<void> {
    this.setLoading(true);
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(() => undefined),
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
