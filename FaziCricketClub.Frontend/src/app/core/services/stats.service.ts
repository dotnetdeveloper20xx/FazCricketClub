import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  ClubStats,
  BattingStats,
  BowlingStats,
  LeaderboardEntry,
  FixtureActivity,
  MemberActivity
} from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/stats`;

  // State signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  /**
   * Get club-wide statistics for dashboard
   */
  getClubStats(): Observable<ClubStats> {
    this.setLoading(true);
    return this.http.get<ApiResponse<ClubStats>>(`${this.baseUrl}/club`).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get batting stats for a player
   */
  getPlayerBattingStats(memberId: string, seasonId?: string): Observable<BattingStats> {
    this.setLoading(true);
    let httpParams = new HttpParams();
    if (seasonId) httpParams = httpParams.set('seasonId', seasonId);

    return this.http.get<ApiResponse<BattingStats>>(`${this.baseUrl}/player/${memberId}/batting`, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get bowling stats for a player
   */
  getPlayerBowlingStats(memberId: string, seasonId?: string): Observable<BowlingStats> {
    this.setLoading(true);
    let httpParams = new HttpParams();
    if (seasonId) httpParams = httpParams.set('seasonId', seasonId);

    return this.http.get<ApiResponse<BowlingStats>>(`${this.baseUrl}/player/${memberId}/bowling`, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get batting leaderboard
   */
  getBattingLeaderboard(seasonId?: string, topN: number = 10): Observable<LeaderboardEntry[]> {
    this.setLoading(true);
    let httpParams = new HttpParams().set('topN', topN.toString());
    if (seasonId) httpParams = httpParams.set('seasonId', seasonId);

    return this.http.get<ApiResponse<LeaderboardEntry[]>>(`${this.baseUrl}/leaderboard/batting`, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get bowling leaderboard
   */
  getBowlingLeaderboard(seasonId?: string, topN: number = 10): Observable<LeaderboardEntry[]> {
    this.setLoading(true);
    let httpParams = new HttpParams().set('topN', topN.toString());
    if (seasonId) httpParams = httpParams.set('seasonId', seasonId);

    return this.http.get<ApiResponse<LeaderboardEntry[]>>(`${this.baseUrl}/leaderboard/bowling`, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get fixture activity over time
   */
  getFixtureActivity(params?: { from?: string; to?: string; seasonId?: string; teamId?: string }): Observable<FixtureActivity[]> {
    this.setLoading(true);
    let httpParams = new HttpParams();
    if (params) {
      if (params.from) httpParams = httpParams.set('from', params.from);
      if (params.to) httpParams = httpParams.set('to', params.to);
      if (params.seasonId) httpParams = httpParams.set('seasonId', params.seasonId);
      if (params.teamId) httpParams = httpParams.set('teamId', params.teamId);
    }

    return this.http.get<ApiResponse<FixtureActivity[]>>(`${this.baseUrl}/fixture-activity`, { params: httpParams }).pipe(
      map(response => response.data),
      tap(() => this.clearError()),
      finalize(() => this.setLoading(false))
    );
  }

  /**
   * Get member sign-up activity over time
   */
  getMemberActivity(params?: { from?: string; to?: string; isActive?: boolean }): Observable<MemberActivity[]> {
    this.setLoading(true);
    let httpParams = new HttpParams();
    if (params) {
      if (params.from) httpParams = httpParams.set('from', params.from);
      if (params.to) httpParams = httpParams.set('to', params.to);
      if (params.isActive !== undefined) httpParams = httpParams.set('isActive', params.isActive.toString());
    }

    return this.http.get<ApiResponse<MemberActivity[]>>(`${this.baseUrl}/member-activity`, { params: httpParams }).pipe(
      map(response => response.data),
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
