import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatsService } from '../../core/services/stats.service';
import { SeasonsService } from '../../core/services/seasons.service';
import { MembersService } from '../../core/services/members.service';
import { BattingStats, BowlingStats, Season, Member } from '../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-player-stats',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <!-- Back Navigation -->
      <div class="back-nav">
        <a routerLink="/statistics/leaderboards" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Leaderboards</span>
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading player statistics...</p>
        </div>
      } @else if (!member()) {
        <div class="card error-state">
          <mat-icon class="error-icon">person_off</mat-icon>
          <h2>Player Not Found</h2>
          <p>The requested player could not be found.</p>
          <a mat-raised-button color="primary" routerLink="/statistics/leaderboards">
            Return to Leaderboards
          </a>
        </div>
      } @else {
        <!-- Player Header -->
        <div class="card player-header">
          <div class="player-avatar">
            <span>{{ getInitials(member()!.fullName) }}</span>
          </div>
          <div class="player-info">
            <h1 class="player-name">{{ member()!.fullName }}</h1>
            <div class="player-meta">
              <span class="meta-item">
                <mat-icon>email</mat-icon>
                {{ member()!.email }}
              </span>
              @if (member()!.joinedOn) {
                <span class="meta-item">
                  <mat-icon>calendar_today</mat-icon>
                  Member since {{ member()!.joinedOn | date:'MMM yyyy' }}
                </span>
              }
            </div>
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

        <!-- Stats Cards -->
        <div class="stats-grid">
          <!-- Batting Stats -->
          <div class="card stats-card">
            <div class="stats-header batting">
              <mat-icon>sports_cricket</mat-icon>
              <h2>Batting Statistics</h2>
            </div>
            <div class="stats-body">
              @if (battingStats()) {
                <div class="stat-highlight">
                  <span class="highlight-value">{{ battingStats()!.runs }}</span>
                  <span class="highlight-label">Total Runs</span>
                </div>

                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-value">{{ battingStats()!.matches }}</span>
                    <span class="stat-label">Matches</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ battingStats()!.innings }}</span>
                    <span class="stat-label">Innings</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ battingStats()!.notOuts }}</span>
                    <span class="stat-label">Not Outs</span>
                  </div>
                </div>

                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-value">{{ battingStats()!.highestScore }}</span>
                    <span class="stat-label">Highest Score</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ battingStats()!.average | number:'1.2-2' }}</span>
                    <span class="stat-label">Average</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ battingStats()!.strikeRate | number:'1.2-2' }}</span>
                    <span class="stat-label">Strike Rate</span>
                  </div>
                </div>

                <div class="stats-row milestones">
                  <div class="milestone">
                    <span class="milestone-value">{{ battingStats()!.fifties }}</span>
                    <span class="milestone-label">50s</span>
                  </div>
                  <div class="milestone">
                    <span class="milestone-value">{{ battingStats()!.hundreds }}</span>
                    <span class="milestone-label">100s</span>
                  </div>
                </div>
              } @else {
                <div class="no-data">
                  <mat-icon>sports_cricket</mat-icon>
                  <p>No batting data available</p>
                </div>
              }
            </div>
          </div>

          <!-- Bowling Stats -->
          <div class="card stats-card">
            <div class="stats-header bowling">
              <mat-icon>sports_baseball</mat-icon>
              <h2>Bowling Statistics</h2>
            </div>
            <div class="stats-body">
              @if (bowlingStats()) {
                <div class="stat-highlight bowling-highlight">
                  <span class="highlight-value">{{ bowlingStats()!.wickets }}</span>
                  <span class="highlight-label">Total Wickets</span>
                </div>

                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.matches }}</span>
                    <span class="stat-label">Matches</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.innings }}</span>
                    <span class="stat-label">Innings</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.overs | number:'1.1-1' }}</span>
                    <span class="stat-label">Overs</span>
                  </div>
                </div>

                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.maidens }}</span>
                    <span class="stat-label">Maidens</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.runs }}</span>
                    <span class="stat-label">Runs Conceded</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.bestFigures || '-' }}</span>
                    <span class="stat-label">Best Figures</span>
                  </div>
                </div>

                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.average | number:'1.2-2' }}</span>
                    <span class="stat-label">Average</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.economy | number:'1.2-2' }}</span>
                    <span class="stat-label">Economy</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-value">{{ bowlingStats()!.strikeRate | number:'1.2-2' }}</span>
                    <span class="stat-label">Strike Rate</span>
                  </div>
                </div>

                <div class="stats-row milestones">
                  <div class="milestone bowling">
                    <span class="milestone-value">{{ bowlingStats()!.fiveWickets }}</span>
                    <span class="milestone-label">5 Wickets</span>
                  </div>
                </div>
              } @else {
                <div class="no-data">
                  <mat-icon>sports_baseball</mat-icon>
                  <p>No bowling data available</p>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .back-nav {
      margin-bottom: 16px;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--app-text-secondary);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: var(--app-primary);
    }

    .back-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      text-align: center;
    }

    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      text-align: center;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--app-text-secondary);
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .error-state h2 {
      margin: 0 0 8px;
    }

    .error-state p {
      color: var(--app-text-secondary);
      margin: 0 0 24px;
    }

    .player-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }

    .player-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--app-primary), #1c961c);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 700;
    }

    .player-info {
      flex: 1;
      min-width: 200px;
    }

    .player-name {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .player-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--app-text-secondary);
      font-size: 14px;
    }

    .meta-item mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .season-filter {
      min-width: 180px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
    }

    .stats-card {
      padding: 0;
      overflow: hidden;
    }

    .stats-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px 24px;
      color: white;
    }

    .stats-header.batting {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .stats-header.bowling {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .stats-header mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stats-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .stats-body {
      padding: 24px;
    }

    .stat-highlight {
      text-align: center;
      padding: 24px;
      background: linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(21, 101, 192, 0.05));
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .stat-highlight.bowling-highlight {
      background: linear-gradient(135deg, rgba(56, 142, 60, 0.1), rgba(46, 125, 50, 0.05));
    }

    .highlight-value {
      display: block;
      font-size: 48px;
      font-weight: 700;
      color: var(--app-primary);
      line-height: 1;
    }

    .highlight-label {
      font-size: 14px;
      color: var(--app-text-secondary);
      margin-top: 8px;
      display: block;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 20px;
    }

    .stats-row.milestones {
      display: flex;
      justify-content: center;
      gap: 32px;
      margin-bottom: 0;
      padding-top: 16px;
      border-top: 1px solid var(--app-border);
    }

    .stat-item {
      text-align: center;
      padding: 16px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .stat-value {
      display: block;
      font-size: 24px;
      font-weight: 700;
      color: var(--app-text);
    }

    .stat-label {
      font-size: 12px;
      color: var(--app-text-secondary);
      margin-top: 4px;
      display: block;
    }

    .milestone {
      text-align: center;
      padding: 16px 24px;
      background: linear-gradient(135deg, #ffd700, #ffb300);
      border-radius: 12px;
    }

    .milestone.bowling {
      background: linear-gradient(135deg, #4caf50, #388e3c);
      color: white;
    }

    .milestone-value {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #5d4e00;
    }

    .milestone.bowling .milestone-value {
      color: white;
    }

    .milestone-label {
      font-size: 12px;
      color: #5d4e00;
      font-weight: 500;
    }

    .milestone.bowling .milestone-label {
      color: rgba(255, 255, 255, 0.9);
    }

    .no-data {
      text-align: center;
      padding: 40px 20px;
      color: var(--app-text-secondary);
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.3;
      margin-bottom: 12px;
    }

    .no-data p {
      margin: 0;
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }

      .player-header {
        flex-direction: column;
        text-align: center;
      }

      .player-meta {
        justify-content: center;
      }

      .season-filter {
        width: 100%;
      }
    }
  `]
})
export class PlayerStatsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private statsService = inject(StatsService);
  private seasonsService = inject(SeasonsService);
  private membersService = inject(MembersService);

  // State
  member = signal<Member | null>(null);
  battingStats = signal<BattingStats | null>(null);
  bowlingStats = signal<BowlingStats | null>(null);
  seasons = signal<Season[]>([]);
  selectedSeason = signal<string>('');
  isLoading = signal(false);

  private memberId = '';

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id') || '';
    if (this.memberId) {
      this.loadSeasons();
      this.loadData();
    }
  }

  loadSeasons(): void {
    this.seasonsService.getSeasons().subscribe({
      next: (seasons) => this.seasons.set(seasons),
      error: (error) => console.error('Error loading seasons:', error)
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    const seasonId = this.selectedSeason() || undefined;

    forkJoin({
      member: this.membersService.getMember(this.memberId),
      batting: this.statsService.getPlayerBattingStats(this.memberId, seasonId),
      bowling: this.statsService.getPlayerBowlingStats(this.memberId, seasonId)
    }).subscribe({
      next: ({ member, batting, bowling }) => {
        this.member.set(member);
        this.battingStats.set(batting);
        this.bowlingStats.set(bowling);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading player data:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSeasonChange(seasonId: string): void {
    this.selectedSeason.set(seasonId);
    this.loadData();
  }

  getInitials(name: string): string {
    return name
      .split(/[\s._-]/)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
}
