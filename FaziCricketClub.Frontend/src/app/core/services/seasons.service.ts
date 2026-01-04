import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  Season,
  CreateSeasonRequest,
  UpdateSeasonRequest
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class SeasonsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/seasons`;

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all seasons
   */
  getSeasons(): Observable<Season[]> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Season[]>>(this.baseUrl).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get single season by ID
   */
  getSeason(id: string): Observable<Season> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Season>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Create new season
   */
  createSeason(season: CreateSeasonRequest): Observable<Season> {
    this.setLoading(true);
    return this.http.post<ApiResponse<Season>>(this.baseUrl, season).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Update existing season
   */
  updateSeason(id: string, season: UpdateSeasonRequest): Observable<Season> {
    this.setLoading(true);
    return this.http.put<ApiResponse<Season>>(`${this.baseUrl}/${id}`, season).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Delete season
   */
  deleteSeason(id: string): Observable<void> {
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
