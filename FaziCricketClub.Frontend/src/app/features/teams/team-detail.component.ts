import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { TeamsService } from '../../core/services/teams.service';
import { FixturesService } from '../../core/services/fixtures.service';
import { Team, Fixture } from '../../shared/models';

@Component({
  selector: 'app-team-detail',
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
        <a routerLink="/teams" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Teams</span>
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading team details...</p>
        </div>
      } @else if (!team()) {
        <div class="card error-state">
          <mat-icon class="error-icon">group_off</mat-icon>
          <h2>Team Not Found</h2>
          <p>The requested team could not be found.</p>
          <a mat-raised-button color="primary" routerLink="/teams">
            Return to Teams
          </a>
        </div>
      } @else {
        <!-- Team Header -->
        <div class="card team-header">
          <div class="team-icon" [class.inactive]="!team()!.isActive">
            <mat-icon>group_work</mat-icon>
          </div>
          <div class="team-info">
            <div class="team-name-row">
              <h1 class="team-name">{{ team()!.name }}</h1>
              <span class="status-chip" [class.active]="team()!.isActive" [class.inactive]="!team()!.isActive">
                {{ team()!.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            @if (team()!.description) {
              <p class="team-description">{{ team()!.description }}</p>
            }
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon matches">
              <mat-icon>sports_cricket</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ totalMatches() }}</span>
              <span class="stat-label">Total Matches</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon upcoming">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ upcomingMatches().length }}</span>
              <span class="stat-label">Upcoming</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon completed">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ completedMatches().length }}</span>
              <span class="stat-label">Completed</span>
            </div>
          </div>
        </div>

        <!-- Fixtures Sections -->
        <div class="fixtures-container">
          <!-- Upcoming Matches -->
          <div class="card fixtures-section">
            <div class="section-header upcoming">
              <mat-icon>event</mat-icon>
              <h3>Upcoming Matches</h3>
            </div>
            <div class="section-body">
              @if (upcomingMatches().length === 0) {
                <div class="empty-state">
                  <mat-icon>event_busy</mat-icon>
                  <p>No upcoming matches scheduled</p>
                </div>
              } @else {
                <div class="fixtures-list">
                  @for (fixture of upcomingMatches(); track fixture.id) {
                    <div class="fixture-item">
                      <div class="fixture-date">
                        <span class="day">{{ fixture.startDateTime | date:'dd' }}</span>
                        <span class="month">{{ fixture.startDateTime | date:'MMM' }}</span>
                      </div>
                      <div class="fixture-details">
                        <span class="teams">
                          <span [class.highlight]="fixture.homeTeamId === team()!.id">{{ fixture.homeTeamName }}</span>
                          <span class="vs">vs</span>
                          <span [class.highlight]="fixture.awayTeamId === team()!.id">{{ fixture.awayTeamName }}</span>
                        </span>
                        <span class="venue"><mat-icon>location_on</mat-icon> {{ fixture.venue }}</span>
                      </div>
                      <div class="fixture-time">
                        {{ fixture.startDateTime | date:'HH:mm' }}
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Recent Results -->
          <div class="card fixtures-section">
            <div class="section-header completed">
              <mat-icon>scoreboard</mat-icon>
              <h3>Recent Results</h3>
            </div>
            <div class="section-body">
              @if (completedMatches().length === 0) {
                <div class="empty-state">
                  <mat-icon>sports_score</mat-icon>
                  <p>No match results yet</p>
                </div>
              } @else {
                <div class="fixtures-list">
                  @for (fixture of completedMatches(); track fixture.id) {
                    <div class="fixture-item result">
                      <div class="fixture-date">
                        <span class="day">{{ fixture.startDateTime | date:'dd' }}</span>
                        <span class="month">{{ fixture.startDateTime | date:'MMM' }}</span>
                      </div>
                      <div class="fixture-details">
                        <div class="result-teams">
                          <div class="result-team" [class.winner]="isWinner(fixture, fixture.homeTeamId)">
                            <span class="team-name">{{ fixture.homeTeamName }}</span>
                            @if (fixture.matchResult) {
                              <span class="score">{{ fixture.matchResult.homeTeamRuns }}/{{ fixture.matchResult.homeTeamWickets }}</span>
                            }
                          </div>
                          <span class="vs-small">vs</span>
                          <div class="result-team" [class.winner]="isWinner(fixture, fixture.awayTeamId)">
                            <span class="team-name">{{ fixture.awayTeamName }}</span>
                            @if (fixture.matchResult) {
                              <span class="score">{{ fixture.matchResult.awayTeamRuns }}/{{ fixture.matchResult.awayTeamWickets }}</span>
                            }
                          </div>
                        </div>
                        @if (fixture.matchResult?.resultSummary) {
                          <span class="result-summary">{{ fixture.matchResult?.resultSummary }}</span>
                        }
                      </div>
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

    .team-header {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .team-icon {
      width: 80px;
      height: 80px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--app-primary), #1c961c);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .team-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
    }

    .team-icon.inactive {
      background: linear-gradient(135deg, #9e9e9e, #757575);
    }

    .team-info {
      flex: 1;
    }

    .team-name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .team-name {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
    }

    .status-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-chip.active {
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .status-chip.inactive {
      background: rgba(158, 158, 158, 0.15);
      color: #616161;
    }

    .team-description {
      margin: 0;
      color: var(--app-text-secondary);
      font-size: 15px;
      line-height: 1.5;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: var(--shadow-card);
    }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.matches {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .stat-icon.upcoming {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .stat-icon.completed {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      line-height: 1;
    }

    .stat-label {
      font-size: 13px;
      color: var(--app-text-secondary);
      margin-top: 4px;
    }

    .fixtures-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .fixtures-section {
      padding: 0;
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      color: white;
    }

    .section-header.upcoming {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .section-header.completed {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .section-header mat-icon {
      font-size: 24px;
    }

    .section-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .section-body {
      padding: 16px;
      max-height: 400px;
      overflow-y: auto;
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--app-text-secondary);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.3;
      margin-bottom: 12px;
    }

    .fixtures-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .fixture-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .fixture-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 44px;
      padding: 8px;
      background: var(--app-primary);
      border-radius: 8px;
      color: white;
    }

    .fixture-date .day {
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }

    .fixture-date .month {
      font-size: 10px;
      text-transform: uppercase;
    }

    .fixture-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .teams {
      font-weight: 500;
    }

    .teams .highlight {
      color: var(--app-primary);
      font-weight: 600;
    }

    .vs {
      color: var(--app-text-secondary);
      margin: 0 6px;
      font-weight: 400;
    }

    .venue {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .venue mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .fixture-time {
      font-size: 13px;
      font-weight: 500;
      color: var(--app-primary);
      padding: 4px 8px;
      background: rgba(46, 184, 46, 0.1);
      border-radius: 4px;
    }

    .result-teams {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .result-team {
      display: flex;
      flex-direction: column;
    }

    .result-team .team-name {
      font-size: 13px;
    }

    .result-team .score {
      font-size: 16px;
      font-weight: 700;
      color: var(--app-text-secondary);
    }

    .result-team.winner .score {
      color: var(--app-primary);
    }

    .vs-small {
      font-size: 11px;
      color: var(--app-text-muted);
    }

    .result-summary {
      font-size: 12px;
      color: var(--app-text-secondary);
      font-style: italic;
    }

    @media (max-width: 1024px) {
      .fixtures-container {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .team-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .team-name-row {
        flex-direction: column;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private teamsService = inject(TeamsService);
  private fixturesService = inject(FixturesService);

  team = signal<Team | null>(null);
  fixtures = signal<Fixture[]>([]);
  isLoading = signal(false);

  private teamId = '';

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id') || '';
    if (this.teamId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading.set(true);

    this.teamsService.getTeam(this.teamId).subscribe({
      next: (team) => {
        this.team.set(team);
        this.loadFixtures();
      },
      error: (error) => {
        console.error('Error loading team:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadFixtures(): void {
    this.fixturesService.getFixtures({ teamId: this.teamId, pageSize: 50 }).subscribe({
      next: (response) => {
        this.fixtures.set(response.items);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.isLoading.set(false);
      }
    });
  }

  totalMatches(): number {
    return this.fixtures().length;
  }

  upcomingMatches(): Fixture[] {
    return this.fixtures()
      .filter(f => f.status === 'Scheduled' || f.status === 'InProgress')
      .sort((a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime())
      .slice(0, 5);
  }

  completedMatches(): Fixture[] {
    return this.fixtures()
      .filter(f => f.status === 'Completed')
      .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
      .slice(0, 5);
  }

  isWinner(fixture: Fixture, teamId: string): boolean {
    return fixture.matchResult?.winningTeamId === teamId;
  }
}
