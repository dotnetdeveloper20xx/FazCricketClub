import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FixturesService } from '../../core/services/fixtures.service';
import { Fixture } from '../../shared/models';

@Component({
  selector: 'app-match-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <!-- Back Navigation -->
      <div class="back-nav">
        <a routerLink="/matches" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Matches</span>
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading match details...</p>
        </div>
      } @else if (!fixture()) {
        <div class="card error-state">
          <mat-icon class="error-icon">sports_cricket</mat-icon>
          <h2>Match Not Found</h2>
          <p>The requested match could not be found.</p>
          <a mat-raised-button color="primary" routerLink="/matches">
            Return to Matches
          </a>
        </div>
      } @else {
        <!-- Match Header -->
        <div class="card match-header">
          <div class="match-status" [class]="getStatusClass(fixture()!.status)">
            <mat-icon>{{ getStatusIcon(fixture()!.status) }}</mat-icon>
            {{ fixture()!.status }}
          </div>

          <div class="teams-display">
            <a [routerLink]="['/teams', fixture()!.homeTeamId]" class="team-block home">
              <div class="team-icon">
                <mat-icon>group_work</mat-icon>
              </div>
              <span class="team-name">{{ fixture()!.homeTeamName }}</span>
              <span class="team-label">Home</span>
              @if (fixture()!.matchResult) {
                <div class="score">
                  <span class="runs">{{ fixture()!.matchResult!.homeTeamRuns }}</span>
                  <span class="wickets">/{{ fixture()!.matchResult!.homeTeamWickets }}</span>
                  <span class="overs">({{ fixture()!.matchResult!.homeTeamOvers }} ov)</span>
                </div>
              }
            </a>

            <div class="vs-section">
              <span class="vs">VS</span>
              <div class="match-date">
                <mat-icon>event</mat-icon>
                {{ fixture()!.startDateTime | date:'EEE, MMM d, yyyy' }}
              </div>
              <div class="match-time">
                <mat-icon>schedule</mat-icon>
                {{ fixture()!.startDateTime | date:'HH:mm' }}
              </div>
            </div>

            <a [routerLink]="['/teams', fixture()!.awayTeamId]" class="team-block away">
              <div class="team-icon">
                <mat-icon>group_work</mat-icon>
              </div>
              <span class="team-name">{{ fixture()!.awayTeamName }}</span>
              <span class="team-label">Away</span>
              @if (fixture()!.matchResult) {
                <div class="score">
                  <span class="runs">{{ fixture()!.matchResult!.awayTeamRuns }}</span>
                  <span class="wickets">/{{ fixture()!.matchResult!.awayTeamWickets }}</span>
                  <span class="overs">({{ fixture()!.matchResult!.awayTeamOvers }} ov)</span>
                </div>
              }
            </a>
          </div>

          @if (fixture()!.matchResult?.winningTeamId) {
            <div class="winner-banner">
              <mat-icon>emoji_events</mat-icon>
              {{ getWinnerName() }} Won
            </div>
          }

          @if (fixture()!.matchResult?.resultSummary) {
            <div class="result-summary">
              {{ fixture()!.matchResult!.resultSummary }}
            </div>
          }
        </div>

        <!-- Match Details -->
        <div class="details-grid">
          <div class="card detail-card">
            <div class="detail-header">
              <mat-icon>info</mat-icon>
              <h3>Match Information</h3>
            </div>
            <div class="detail-body">
              <div class="detail-item">
                <span class="detail-label">Venue</span>
                <span class="detail-value">
                  <mat-icon>location_on</mat-icon>
                  {{ fixture()!.venue }}
                </span>
              </div>
              @if (fixture()!.competitionName) {
                <div class="detail-item">
                  <span class="detail-label">Competition</span>
                  <span class="detail-value">
                    <mat-icon>military_tech</mat-icon>
                    {{ fixture()!.competitionName }}
                  </span>
                </div>
              }
              @if (fixture()!.seasonName) {
                <div class="detail-item">
                  <span class="detail-label">Season</span>
                  <span class="detail-value">
                    <mat-icon>calendar_today</mat-icon>
                    {{ fixture()!.seasonName }}
                  </span>
                </div>
              }
              <div class="detail-item">
                <span class="detail-label">Date & Time</span>
                <span class="detail-value">
                  <mat-icon>event</mat-icon>
                  {{ fixture()!.startDateTime | date:'EEEE, MMMM d, yyyy' }} at {{ fixture()!.startDateTime | date:'HH:mm' }}
                </span>
              </div>
            </div>
          </div>

          @if (fixture()!.matchResult) {
            <div class="card detail-card">
              <div class="detail-header result">
                <mat-icon>scoreboard</mat-icon>
                <h3>Match Result</h3>
              </div>
              <div class="detail-body">
                <div class="scorecard">
                  <div class="scorecard-row" [class.winner]="fixture()!.matchResult!.winningTeamId === fixture()!.homeTeamId">
                    <span class="team">{{ fixture()!.homeTeamName }}</span>
                    <span class="innings">
                      {{ fixture()!.matchResult!.homeTeamRuns }}/{{ fixture()!.matchResult!.homeTeamWickets }}
                      <span class="overs-small">({{ fixture()!.matchResult!.homeTeamOvers }} ov)</span>
                    </span>
                  </div>
                  <div class="scorecard-row" [class.winner]="fixture()!.matchResult!.winningTeamId === fixture()!.awayTeamId">
                    <span class="team">{{ fixture()!.awayTeamName }}</span>
                    <span class="innings">
                      {{ fixture()!.matchResult!.awayTeamRuns }}/{{ fixture()!.matchResult!.awayTeamWickets }}
                      <span class="overs-small">({{ fixture()!.matchResult!.awayTeamOvers }} ov)</span>
                    </span>
                  </div>
                </div>
                @if (fixture()!.matchResult!.notes) {
                  <div class="result-notes">
                    <span class="notes-label">Notes</span>
                    <p>{{ fixture()!.matchResult!.notes }}</p>
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="card detail-card">
              <div class="detail-header upcoming">
                <mat-icon>hourglass_empty</mat-icon>
                <h3>Match Status</h3>
              </div>
              <div class="detail-body">
                <div class="pending-state">
                  @switch (fixture()!.status) {
                    @case ('Scheduled') {
                      <mat-icon class="status-icon scheduled">event</mat-icon>
                      <h4>Match Scheduled</h4>
                      <p>This match is scheduled for {{ fixture()!.startDateTime | date:'MMMM d, yyyy' }}</p>
                    }
                    @case ('InProgress') {
                      <mat-icon class="status-icon in-progress">sports_cricket</mat-icon>
                      <h4>Match In Progress</h4>
                      <p>This match is currently being played</p>
                    }
                    @case ('Cancelled') {
                      <mat-icon class="status-icon cancelled">cancel</mat-icon>
                      <h4>Match Cancelled</h4>
                      <p>This match has been cancelled</p>
                    }
                    @case ('Postponed') {
                      <mat-icon class="status-icon postponed">schedule</mat-icon>
                      <h4>Match Postponed</h4>
                      <p>This match has been postponed</p>
                    }
                  }
                </div>
              </div>
            </div>
          }
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 20px;
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

    .match-header {
      padding: 24px;
      margin-bottom: 24px;
      text-align: center;
    }

    .match-status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 24px;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .match-status mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .match-status.scheduled {
      background: rgba(33, 150, 243, 0.15);
      color: #1976d2;
    }

    .match-status.in-progress {
      background: rgba(255, 152, 0, 0.15);
      color: #f57c00;
    }

    .match-status.completed {
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .match-status.cancelled {
      background: rgba(244, 67, 54, 0.15);
      color: #d32f2f;
    }

    .match-status.postponed {
      background: rgba(156, 39, 176, 0.15);
      color: #7b1fa2;
    }

    .teams-display {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 32px;
      margin-bottom: 24px;
    }

    .team-block {
      flex: 1;
      max-width: 280px;
      padding: 24px;
      background: var(--app-background);
      border-radius: 12px;
      text-decoration: none;
      color: inherit;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .team-block:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-card);
    }

    .team-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--app-primary), #1c961c);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .team-icon mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .team-name {
      font-size: 18px;
      font-weight: 600;
    }

    .team-label {
      font-size: 12px;
      color: var(--app-text-secondary);
      text-transform: uppercase;
    }

    .score {
      margin-top: 8px;
      padding: 8px 16px;
      background: white;
      border-radius: 8px;
    }

    .score .runs {
      font-size: 24px;
      font-weight: 700;
      color: var(--app-primary);
    }

    .score .wickets {
      font-size: 18px;
      font-weight: 600;
      color: var(--app-text-secondary);
    }

    .score .overs {
      font-size: 13px;
      color: var(--app-text-muted);
      margin-left: 4px;
    }

    .vs-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .vs {
      font-size: 24px;
      font-weight: 700;
      color: var(--app-text-secondary);
    }

    .match-date,
    .match-time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .match-date mat-icon,
    .match-time mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .winner-banner {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #ffc107, #ff9800);
      color: white;
      border-radius: 24px;
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 12px;
    }

    .result-summary {
      color: var(--app-text-secondary);
      font-style: italic;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .detail-card {
      padding: 0;
      overflow: hidden;
    }

    .detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: var(--app-primary);
      color: white;
    }

    .detail-header.result {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .detail-header.upcoming {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .detail-header mat-icon {
      font-size: 24px;
    }

    .detail-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .detail-body {
      padding: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid var(--app-border);
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .detail-value {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .detail-value mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--app-text-secondary);
    }

    .scorecard {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .scorecard-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .scorecard-row.winner {
      background: rgba(76, 175, 80, 0.1);
      border-left: 4px solid #388e3c;
    }

    .scorecard-row .team {
      font-weight: 500;
    }

    .scorecard-row .innings {
      font-size: 18px;
      font-weight: 700;
    }

    .scorecard-row.winner .innings {
      color: #388e3c;
    }

    .overs-small {
      font-size: 12px;
      font-weight: 400;
      color: var(--app-text-secondary);
      margin-left: 4px;
    }

    .result-notes {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid var(--app-border);
    }

    .notes-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--app-text-secondary);
    }

    .result-notes p {
      margin: 8px 0 0;
      color: var(--app-text-secondary);
    }

    .pending-state {
      text-align: center;
      padding: 24px;
    }

    .status-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
    }

    .status-icon.scheduled {
      color: #1976d2;
    }

    .status-icon.in-progress {
      color: #f57c00;
    }

    .status-icon.cancelled {
      color: #d32f2f;
    }

    .status-icon.postponed {
      color: #7b1fa2;
    }

    .pending-state h4 {
      margin: 0 0 8px;
    }

    .pending-state p {
      margin: 0;
      color: var(--app-text-secondary);
    }

    @media (max-width: 900px) {
      .teams-display {
        flex-direction: column;
        align-items: center;
      }

      .team-block {
        max-width: 100%;
        width: 100%;
      }

      .vs-section {
        padding: 16px 0;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MatchDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fixturesService = inject(FixturesService);

  fixture = signal<Fixture | null>(null);
  isLoading = signal(false);

  private fixtureId = '';

  ngOnInit(): void {
    this.fixtureId = this.route.snapshot.paramMap.get('id') || '';
    if (this.fixtureId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading.set(true);

    this.fixturesService.getFixture(this.fixtureId).subscribe({
      next: (fixture) => {
        this.fixture.set(fixture);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading fixture:', error);
        this.isLoading.set(false);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Scheduled': return 'scheduled';
      case 'InProgress': return 'in-progress';
      case 'Completed': return 'completed';
      case 'Cancelled': return 'cancelled';
      case 'Postponed': return 'postponed';
      default: return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'Scheduled': return 'event';
      case 'InProgress': return 'sports_cricket';
      case 'Completed': return 'check_circle';
      case 'Cancelled': return 'cancel';
      case 'Postponed': return 'schedule';
      default: return 'info';
    }
  }

  getWinnerName(): string {
    const f = this.fixture();
    if (!f?.matchResult?.winningTeamId) return '';
    return f.matchResult.winningTeamId === f.homeTeamId
      ? f.homeTeamName || 'Home Team'
      : f.awayTeamName || 'Away Team';
  }
}
