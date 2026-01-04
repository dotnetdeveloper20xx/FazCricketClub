import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../core/auth/auth.service';
import { StatsService } from '../../core/services/stats.service';
import { FixturesService } from '../../core/services/fixtures.service';
import { ClubStats, Fixture } from '../../shared/models';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section animate-in">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome back, {{ userName() }}!</h1>
          <p class="welcome-subtitle">Here's what's happening with your cricket club today.</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary" routerLink="/members">
            <mat-icon>groups</mat-icon>
            View Members
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading dashboard data...</p>
        </div>
      } @else {
        <!-- Stats Grid -->
        <div class="stats-grid">
          @for (stat of stats(); track stat.title) {
            <div class="stat-card animate-in" [style.--accent-color]="stat.color">
              <div class="stat-icon-wrapper" [style.background]="stat.color + '15'">
                <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
              </div>
              <div class="stat-content">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-title">{{ stat.title }}</span>
                @if (stat.subtitle) {
                  <span class="stat-subtitle">{{ stat.subtitle }}</span>
                }
              </div>
            </div>
          }
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Upcoming Matches -->
          <div class="card upcoming-matches animate-in">
            <div class="card-header">
              <h3 class="card-title">
                <mat-icon>sports_score</mat-icon>
                Upcoming Matches
              </h3>
              <a mat-button class="view-all-btn" routerLink="/matches">View All</a>
            </div>
            <div class="matches-list">
              @if (upcomingFixtures().length === 0) {
                <div class="empty-state">
                  <mat-icon>event_busy</mat-icon>
                  <p>No upcoming matches scheduled</p>
                </div>
              } @else {
                @for (fixture of upcomingFixtures(); track fixture.id) {
                  <div class="match-item">
                    <div class="match-date">
                      <span class="match-day">{{ getDay(fixture.startDateTime) }}</span>
                      <span class="match-month">{{ getMonth(fixture.startDateTime) }}</span>
                    </div>
                    <div class="match-info">
                      <span class="match-teams">{{ fixture.homeTeamName }} vs {{ fixture.awayTeamName }}</span>
                      <span class="match-venue">
                        <mat-icon>location_on</mat-icon>
                        {{ fixture.venue }}
                      </span>
                    </div>
                    <div class="match-time">
                      <mat-icon>schedule</mat-icon>
                      {{ getTime(fixture.startDateTime) }}
                    </div>
                  </div>
                }
              }
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="card quick-stats animate-in">
            <div class="card-header">
              <h3 class="card-title">
                <mat-icon>analytics</mat-icon>
                Season Overview
              </h3>
            </div>
            <div class="stats-overview">
              <div class="overview-item">
                <div class="overview-icon completed">
                  <mat-icon>check_circle</mat-icon>
                </div>
                <div class="overview-content">
                  <span class="overview-value">{{ clubStats()?.completedFixtures || 0 }}</span>
                  <span class="overview-label">Completed Matches</span>
                </div>
              </div>
              <div class="overview-item">
                <div class="overview-icon upcoming">
                  <mat-icon>event</mat-icon>
                </div>
                <div class="overview-content">
                  <span class="overview-value">{{ clubStats()?.upcomingFixtures || 0 }}</span>
                  <span class="overview-label">Upcoming Matches</span>
                </div>
              </div>
              <div class="overview-item">
                <div class="overview-icon active">
                  <mat-icon>person_check</mat-icon>
                </div>
                <div class="overview-content">
                  <span class="overview-value">{{ clubStats()?.activeMembers || 0 }}</span>
                  <span class="overview-label">Active Members</span>
                </div>
              </div>
              <div class="overview-item">
                <div class="overview-icon seasons">
                  <mat-icon>date_range</mat-icon>
                </div>
                <div class="overview-content">
                  <span class="overview-value">{{ clubStats()?.totalSeasons || 0 }}</span>
                  <span class="overview-label">Seasons</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card quick-actions animate-in">
            <div class="card-header">
              <h3 class="card-title">
                <mat-icon>flash_on</mat-icon>
                Quick Actions
              </h3>
            </div>
            <div class="actions-grid">
              @for (action of quickActions; track action.label) {
                <a class="action-btn" [routerLink]="action.route" [style.--action-color]="action.color">
                  <mat-icon>{{ action.icon }}</mat-icon>
                  <span>{{ action.label }}</span>
                </a>
              }
            </div>
          </div>

          <!-- Recent Activity Placeholder -->
          <div class="card recent-activity animate-in">
            <div class="card-header">
              <h3 class="card-title">
                <mat-icon>history</mat-icon>
                Club Information
              </h3>
            </div>
            <div class="info-content">
              <div class="info-item">
                <mat-icon>groups</mat-icon>
                <div>
                  <strong>Total Members:</strong> {{ clubStats()?.totalMembers || 0 }}
                </div>
              </div>
              <div class="info-item">
                <mat-icon>group_work</mat-icon>
                <div>
                  <strong>Total Teams:</strong> {{ clubStats()?.totalTeams || 0 }}
                </div>
              </div>
              <div class="info-item">
                <mat-icon>sports_cricket</mat-icon>
                <div>
                  <strong>Total Fixtures:</strong> {{ clubStats()?.totalFixtures || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Error State -->
      @if (error()) {
        <div class="error-message">
          <mat-icon>error</mat-icon>
          {{ error() }}
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      gap: 16px;
      color: var(--app-text-secondary);
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 8px;
      margin-top: 20px;
    }

    /* Welcome Section */
    .welcome-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 24px;
      background: linear-gradient(135deg, #2eb82e 0%, #1c961c 100%);
      border-radius: 16px;
      color: white;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .welcome-subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 15px;
    }

    .welcome-actions .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .welcome-actions .btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      box-shadow: var(--shadow-card-hover);
      transform: translateY(-2px);
    }

    .stat-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon-wrapper mat-icon {
      font-size: 26px;
      width: 26px;
      height: 26px;
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-family: 'Montserrat', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--app-text);
      line-height: 1;
    }

    .stat-title {
      font-size: 14px;
      color: var(--app-text-secondary);
      margin-top: 4px;
    }

    .stat-subtitle {
      font-size: 12px;
      color: var(--app-text-muted);
      margin-top: 4px;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--app-divider);
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      color: var(--app-text);
      margin: 0;
    }

    .card-title mat-icon {
      color: var(--app-primary);
    }

    .view-all-btn {
      color: var(--app-primary);
      font-size: 13px;
      text-decoration: none;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
      color: var(--app-text-muted);
    }

    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    /* Upcoming Matches */
    .matches-list {
      padding: 12px 0;
    }

    .match-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 24px;
      transition: background 0.2s ease;
    }

    .match-item:hover {
      background: var(--app-surface-alt);
    }

    .match-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #2eb82e 0%, #1c961c 100%);
      border-radius: 8px;
      color: white;
    }

    .match-day {
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 700;
      line-height: 1;
    }

    .match-month {
      font-size: 10px;
      text-transform: uppercase;
      opacity: 0.9;
    }

    .match-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .match-teams {
      font-weight: 600;
      color: var(--app-text);
    }

    .match-venue {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .match-venue mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .match-time {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--app-text-secondary);
      padding: 6px 12px;
      background: var(--app-surface-alt);
      border-radius: 20px;
    }

    .match-time mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Stats Overview */
    .stats-overview {
      padding: 20px 24px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .overview-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: var(--app-surface-alt);
      border-radius: 10px;
    }

    .overview-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .overview-icon.completed {
      background: #dcfce7;
      color: #16a34a;
    }

    .overview-icon.upcoming {
      background: #dbeafe;
      color: #2563eb;
    }

    .overview-icon.active {
      background: #fef3c7;
      color: #d97706;
    }

    .overview-icon.seasons {
      background: #fce7f3;
      color: #db2777;
    }

    .overview-content {
      display: flex;
      flex-direction: column;
    }

    .overview-value {
      font-family: 'Montserrat', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--app-text);
    }

    .overview-label {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    /* Quick Actions */
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      padding: 20px 24px;
    }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 20px;
      background: var(--app-surface-alt);
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .action-btn:hover {
      background: #e6f7e6;
    }

    .action-btn mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: var(--action-color, var(--app-primary));
    }

    .action-btn span {
      font-size: 13px;
      font-weight: 500;
      color: var(--app-text);
    }

    /* Info Content */
    .info-content {
      padding: 20px 24px;
    }

    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 0;
      border-bottom: 1px solid var(--app-divider);
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-item mat-icon {
      color: var(--app-primary);
    }

    /* Animation */
    .animate-in {
      animation: fadeSlideIn 0.4s ease-out;
    }

    @keyframes fadeSlideIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }

      .stats-overview {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .welcome-section {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .stats-overview {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private statsService = inject(StatsService);
  private fixturesService = inject(FixturesService);

  // State signals
  clubStats = signal<ClubStats | null>(null);
  upcomingFixtures = signal<Fixture[]>([]);
  isLoading = signal(true);
  error = signal<string | null>(null);

  // Computed properties
  userName = computed(() => {
    const user = this.authService.currentUser();
    if (user?.firstName) {
      return user.firstName;
    }
    return user?.userName || 'User';
  });

  stats = computed<StatCard[]>(() => {
    const data = this.clubStats();
    return [
      {
        title: 'Total Members',
        value: data?.totalMembers || 0,
        icon: 'groups',
        subtitle: `${data?.activeMembers || 0} active`,
        color: '#2eb82e'
      },
      {
        title: 'Teams',
        value: data?.totalTeams || 0,
        icon: 'group_work',
        color: '#3b82f6'
      },
      {
        title: 'Total Fixtures',
        value: data?.totalFixtures || 0,
        icon: 'sports_cricket',
        subtitle: `${data?.completedFixtures || 0} completed`,
        color: '#ffc107'
      },
      {
        title: 'Upcoming',
        value: data?.upcomingFixtures || 0,
        icon: 'event',
        subtitle: 'matches scheduled',
        color: '#ec4899'
      },
    ];
  });

  quickActions = [
    { label: 'Members', icon: 'groups', route: '/members', color: '#2eb82e' },
    { label: 'Matches', icon: 'sports_score', route: '/matches', color: '#3b82f6' },
    { label: 'Teams', icon: 'group_work', route: '/teams', color: '#ffc107' },
    { label: 'Admin', icon: 'admin_panel_settings', route: '/admin/users', color: '#ec4899' },
  ];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Load club stats
    this.statsService.getClubStats().subscribe({
      next: (stats) => {
        this.clubStats.set(stats);
      },
      error: (err) => {
        console.error('Failed to load club stats:', err);
        // Don't show error if just no data
      }
    });

    // Load upcoming fixtures
    this.fixturesService.getUpcomingFixtures(30).subscribe({
      next: (fixtures) => {
        this.upcomingFixtures.set(fixtures.slice(0, 5)); // Show top 5
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load upcoming fixtures:', err);
        this.isLoading.set(false);
        // Don't show error for empty fixtures
      }
    });
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr);
    return date.getDate().toString();
  }

  getMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'short' });
  }

  getTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }
}
