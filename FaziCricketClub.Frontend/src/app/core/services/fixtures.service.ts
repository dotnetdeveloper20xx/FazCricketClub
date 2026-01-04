import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  PaginationParams,
  Fixture,
  CreateFixtureRequest,
  UpdateFixtureRequest,
  MatchResult
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class FixturesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/fixtures`;

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get paginated list of fixtures
   */
  getFixtures(params?: PaginationParams & { seasonId?: string; teamId?: string; status?: string }): Observable<PaginatedResponse<Fixture>> {
    this.setLoading(true);

    let httpParams = new HttpParams();
    if (params) {
      if (params.pageNumber) httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
      if (params.sortDescending !== undefined) httpParams = httpParams.set('sortDescending', params.sortDescending.toString());
      if (params.searchTerm) httpParams = httpParams.set('searchTerm', params.searchTerm);
      if (params.seasonId) httpParams = httpParams.set('seasonId', params.seasonId);
      if (params.teamId) httpParams = httpParams.set('teamId', params.teamId);
      if (params.status) httpParams = httpParams.set('status', params.status);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Fixture>>>(this.baseUrl, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get all fixtures (non-paginated)
   */
  getAllFixtures(): Observable<Fixture[]> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Fixture[]>>(`${this.baseUrl}/all`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get upcoming fixtures
   */
  getUpcomingFixtures(days: number = 30, teamId?: string): Observable<Fixture[]> {
    this.setLoading(true);
    let httpParams = new HttpParams().set('days', days.toString());
    if (teamId) httpParams = httpParams.set('teamId', teamId);

    return this.http.get<ApiResponse<Fixture[]>>(`${this.baseUrl}/upcoming`, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get single fixture by ID
   */
  getFixture(id: string): Observable<Fixture> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Fixture>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Create new fixture
   */
  createFixture(fixture: CreateFixtureRequest): Observable<Fixture> {
    this.setLoading(true);
    return this.http.post<ApiResponse<Fixture>>(this.baseUrl, fixture).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Update existing fixture
   */
  updateFixture(id: string, fixture: UpdateFixtureRequest): Observable<Fixture> {
    this.setLoading(true);
    return this.http.put<ApiResponse<Fixture>>(`${this.baseUrl}/${id}`, fixture).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Delete fixture (soft delete)
   */
  deleteFixture(id: string): Observable<void> {
    this.setLoading(true);
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(() => undefined),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Create or update match result
   */
  saveMatchResult(fixtureId: string, result: Partial<MatchResult>): Observable<MatchResult> {
    this.setLoading(true);
    return this.http.post<ApiResponse<MatchResult>>(`${this.baseUrl}/${fixtureId}/result`, result).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get match result for fixture
   */
  getMatchResult(fixtureId: string): Observable<MatchResult> {
    this.setLoading(true);
    return this.http.get<ApiResponse<MatchResult>>(`${this.baseUrl}/${fixtureId}/result`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Delete match result
   */
  deleteMatchResult(fixtureId: string): Observable<void> {
    this.setLoading(true);
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${fixtureId}/result`).pipe(
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
