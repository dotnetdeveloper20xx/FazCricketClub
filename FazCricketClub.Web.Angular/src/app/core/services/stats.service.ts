import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { PlayerBattingStats, PlayerBowlingStats } from '../models/cricket.model';

@Injectable({
  providedIn: 'root'
})
export class StatsService {
  private readonly endpoint = 'stats';

  constructor(private apiService: ApiService) {}

  /**
   * Get player batting stats
   */
  getPlayerBattingStats(memberId: number, seasonId?: number): Observable<PlayerBattingStats> {
    const params = seasonId ? new HttpParams().set('seasonId', seasonId.toString()) : undefined;
    return this.apiService.get<PlayerBattingStats>(`${this.endpoint}/player/${memberId}/batting`, params);
  }

  /**
   * Get player bowling stats
   */
  getPlayerBowlingStats(memberId: number, seasonId?: number): Observable<PlayerBowlingStats> {
    const params = seasonId ? new HttpParams().set('seasonId', seasonId.toString()) : undefined;
    return this.apiService.get<PlayerBowlingStats>(`${this.endpoint}/player/${memberId}/bowling`, params);
  }

  /**
   * Get batting leaderboard
   */
  getBattingLeaderboard(seasonId?: number, topN: number = 10): Observable<PlayerBattingStats[]> {
    let params = new HttpParams().set('topN', topN.toString());
    if (seasonId) {
      params = params.set('seasonId', seasonId.toString());
    }
    return this.apiService.get<PlayerBattingStats[]>(`${this.endpoint}/leaderboard/batting`, params);
  }

  /**
   * Get bowling leaderboard
   */
  getBowlingLeaderboard(seasonId?: number, topN: number = 10): Observable<PlayerBowlingStats[]> {
    let params = new HttpParams().set('topN', topN.toString());
    if (seasonId) {
      params = params.set('seasonId', seasonId.toString());
    }
    return this.apiService.get<PlayerBowlingStats[]>(`${this.endpoint}/leaderboard/bowling`, params);
  }

  /**
   * Get club stats
   */
  getClubStats(): Observable<any> {
    return this.apiService.get<any>(`${this.endpoint}/club`);
  }
}
