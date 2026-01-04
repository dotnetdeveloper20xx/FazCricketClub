import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  Team,
  CreateTeamRequest,
  UpdateTeamRequest
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/teams`;

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get all teams
   */
  getTeams(): Observable<Team[]> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Team[]>>(this.baseUrl).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get single team by ID
   */
  getTeam(id: string): Observable<Team> {
    this.setLoading(true);
    return this.http.get<ApiResponse<Team>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Create new team
   */
  createTeam(team: CreateTeamRequest): Observable<Team> {
    this.setLoading(true);
    return this.http.post<ApiResponse<Team>>(this.baseUrl, team).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Update existing team
   */
  updateTeam(id: string, team: UpdateTeamRequest): Observable<Team> {
    this.setLoading(true);
    return this.http.put<ApiResponse<Team>>(`${this.baseUrl}/${id}`, team).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Delete team
   */
  deleteTeam(id: string): Observable<void> {
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
