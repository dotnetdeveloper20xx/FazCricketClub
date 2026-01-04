import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatsService } from '../../core/services/stats.service';
import { SeasonsService } from '../../core/services/seasons.service';
import { LeaderboardEntry, Season } from '../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-leaderboards',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Leaderboards</h1>
          <p class="page-description">Top performers in batting and bowling</p>
        </div>
        <mat-form-field appearance="outline" class="season-filter">
          <mat-label>Season</mat-label>
          <mat-select [value]="selectedSeason()" (selectionChange)="onSeasonChange($event.value)">
            <mat-option value="">All Time</mat-option>
            @for (season of seasons(); track season.id) {
              <mat-option [value]="season.id">{{ season.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading leaderboards...</p>
        </div>
      } @else {
        <div class="leaderboards-container">
          <!-- Batting Leaderboard -->
          <div class="card leaderboard-card">
            <div class="leaderboard-header batting">
              <mat-icon>sports_cricket</mat-icon>
              <h2>Top Run Scorers</h2>
            </div>
            <div class="leaderboard-body">
              @if (battingLeaderboard().length === 0) {
                <div class="empty-state">
                  <p>No batting data available</p>
                </div>
              } @else {
                <div class="leaderboard-list">
                  @for (entry of battingLeaderboard(); track entry.memberId; let i = $index) {
                    <div class="leaderboard-row" [class.top-3]="i < 3">
                      <div class="rank" [class]="getRankClass(i)">
                        @if (i < 3) {
                          <mat-icon>{{ getMedalIcon(i) }}</mat-icon>
                        } @else {
                          {{ i + 1 }}
                        }
                      </div>
                      <div class="player-info">
                        <a [routerLink]="['/statistics/player', entry.memberId]" class="player-name">
                          {{ entry.memberName }}
                        </a>
                      </div>
                      <div class="stats">
                        <span class="primary-stat">{{ entry.value }}</span>
                        <span class="stat-label">runs</span>
                      </div>
                      @if (entry.secondaryValue) {
                        <div class="secondary-stat">
                          <span>Avg: {{ entry.secondaryValue | number:'1.2-2' }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Bowling Leaderboard -->
          <div class="card leaderboard-card">
            <div class="leaderboard-header bowling">
              <mat-icon>sports_baseball</mat-icon>
              <h2>Top Wicket Takers</h2>
            </div>
            <div class="leaderboard-body">
              @if (bowlingLeaderboard().length === 0) {
                <div class="empty-state">
                  <p>No bowling data available</p>
                </div>
              } @else {
                <div class="leaderboard-list">
                  @for (entry of bowlingLeaderboard(); track entry.memberId; let i = $index) {
                    <div class="leaderboard-row" [class.top-3]="i < 3">
                      <div class="rank" [class]="getRankClass(i)">
                        @if (i < 3) {
                          <mat-icon>{{ getMedalIcon(i) }}</mat-icon>
                        } @else {
                          {{ i + 1 }}
                        }
                      </div>
                      <div class="player-info">
                        <a [routerLink]="['/statistics/player', entry.memberId]" class="player-name">
                          {{ entry.memberName }}
                        </a>
                      </div>
                      <div class="stats">
                        <span class="primary-stat">{{ entry.value }}</span>
                        <span class="stat-label">wickets</span>
                      </div>
                      @if (entry.secondaryValue) {
                        <div class="secondary-stat">
                          <span>Avg: {{ entry.secondaryValue | number:'1.2-2' }}</span>
                        </div>
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px;
    }

    .page-description {
      color: var(--app-text-secondary);
      margin: 0;
    }

    .season-filter {
      min-width: 200px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .leaderboards-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .leaderboard-card {
      padding: 0;
      overflow: hidden;
    }

    .leaderboard-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px;
      color: white;
    }

    .leaderboard-header.batting {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .leaderboard-header.bowling {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .leaderboard-header mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .leaderboard-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .leaderboard-body {
      padding: 16px;
    }

    .leaderboard-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .leaderboard-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      border-radius: 8px;
      background: var(--app-background);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .leaderboard-row:hover {
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .leaderboard-row.top-3 {
      background: linear-gradient(90deg, var(--app-background), var(--app-surface));
    }

    .rank {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      background: var(--app-surface);
      color: var(--app-text-secondary);
    }

    .rank.gold {
      background: linear-gradient(135deg, #ffd700, #ffb300);
      color: #5d4e00;
    }

    .rank.silver {
      background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
      color: #404040;
    }

    .rank.bronze {
      background: linear-gradient(135deg, #cd7f32, #b06c2a);
      color: #3d2810;
    }

    .rank mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .player-info {
      flex: 1;
    }

    .player-name {
      font-weight: 500;
      color: var(--app-text);
      text-decoration: none;
      transition: color 0.2s;
    }

    .player-name:hover {
      color: var(--app-primary);
    }

    .stats {
      display: flex;
      align-items: baseline;
      gap: 4px;
    }

    .primary-stat {
      font-size: 20px;
      font-weight: 700;
      color: var(--app-primary);
    }

    .stat-label {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .secondary-stat {
      min-width: 80px;
      text-align: right;
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--app-text-secondary);
    }

    @media (max-width: 768px) {
      .leaderboards-container {
        grid-template-columns: 1fr;
      }

      .leaderboard-row {
        flex-wrap: wrap;
      }

      .secondary-stat {
        width: 100%;
        text-align: left;
        margin-top: 4px;
        padding-left: 52px;
      }
    }
  `]
})
export class LeaderboardsComponent implements OnInit {
  private statsService = inject(StatsService);
  private seasonsService = inject(SeasonsService);

  // State
  battingLeaderboard = signal<LeaderboardEntry[]>([]);
  bowlingLeaderboard = signal<LeaderboardEntry[]>([]);
  seasons = signal<Season[]>([]);
  selectedSeason = signal<string>('');
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadSeasons();
    this.loadLeaderboards();
  }

  loadSeasons(): void {
    this.seasonsService.getSeasons().subscribe({
      next: (seasons) => this.seasons.set(seasons),
      error: (error) => console.error('Error loading seasons:', error)
    });
  }

  loadLeaderboards(): void {
    this.isLoading.set(true);
    const seasonId = this.selectedSeason() || undefined;

    forkJoin({
      batting: this.statsService.getBattingLeaderboard(seasonId, 10),
      bowling: this.statsService.getBowlingLeaderboard(seasonId, 10)
    }).subscribe({
      next: ({ batting, bowling }) => {
        this.battingLeaderboard.set(batting);
        this.bowlingLeaderboard.set(bowling);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading leaderboards:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSeasonChange(seasonId: string): void {
    this.selectedSeason.set(seasonId);
    this.loadLeaderboards();
  }

  getRankClass(index: number): string {
    switch (index) {
      case 0: return 'gold';
      case 1: return 'silver';
      case 2: return 'bronze';
      default: return '';
    }
  }

  getMedalIcon(index: number): string {
    switch (index) {
      case 0: return 'emoji_events';
      case 1: return 'military_tech';
      case 2: return 'workspace_premium';
      default: return '';
    }
  }
}
