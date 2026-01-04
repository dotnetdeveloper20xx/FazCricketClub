import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: string;
}

interface RecentActivity {
  icon: string;
  title: string;
  description: string;
  time: string;
  type: 'match' | 'member' | 'practice' | 'announcement';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  template: `
    <div class="dashboard">
      <!-- Welcome Section -->
      <div class="welcome-section animate-in">
        <div class="welcome-content">
          <h1 class="welcome-title">Welcome back, Admin!</h1>
          <p class="welcome-subtitle">Here's what's happening with your cricket club today.</p>
        </div>
        <div class="welcome-actions">
          <button class="btn btn-primary">
            <mat-icon>add</mat-icon>
            Quick Action
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        @for (stat of stats; track stat.title) {
          <div class="stat-card animate-in" [style.--accent-color]="stat.color">
            <div class="stat-icon-wrapper" [style.background]="stat.color + '15'">
              <mat-icon [style.color]="stat.color">{{ stat.icon }}</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-title">{{ stat.title }}</span>
              @if (stat.change) {
                <span class="stat-change" [class]="stat.changeType">
                  <mat-icon>{{ stat.changeType === 'positive' ? 'trending_up' : stat.changeType === 'negative' ? 'trending_down' : 'trending_flat' }}</mat-icon>
                  {{ stat.change }}
                </span>
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
            <button mat-button class="view-all-btn">View All</button>
          </div>
          <div class="matches-list">
            @for (match of upcomingMatches; track match.id) {
              <div class="match-item">
                <div class="match-date">
                  <span class="match-day">{{ match.day }}</span>
                  <span class="match-month">{{ match.month }}</span>
                </div>
                <div class="match-info">
                  <span class="match-teams">{{ match.homeTeam }} vs {{ match.awayTeam }}</span>
                  <span class="match-venue">
                    <mat-icon>location_on</mat-icon>
                    {{ match.venue }}
                  </span>
                </div>
                <div class="match-time">
                  <mat-icon>schedule</mat-icon>
                  {{ match.time }}
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="card recent-activity animate-in">
          <div class="card-header">
            <h3 class="card-title">
              <mat-icon>history</mat-icon>
              Recent Activity
            </h3>
            <button mat-button class="view-all-btn">View All</button>
          </div>
          <div class="activity-list">
            @for (activity of recentActivities; track $index) {
              <div class="activity-item">
                <div class="activity-icon" [class]="activity.type">
                  <mat-icon>{{ activity.icon }}</mat-icon>
                </div>
                <div class="activity-content">
                  <span class="activity-title">{{ activity.title }}</span>
                  <span class="activity-description">{{ activity.description }}</span>
                </div>
                <span class="activity-time">{{ activity.time }}</span>
              </div>
            }
          </div>
        </div>

        <!-- Top Performers -->
        <div class="card top-performers animate-in">
          <div class="card-header">
            <h3 class="card-title">
              <mat-icon>emoji_events</mat-icon>
              Top Performers
            </h3>
            <button mat-button class="view-all-btn">View All</button>
          </div>
          <div class="performers-list">
            @for (performer of topPerformers; track performer.name; let i = $index) {
              <div class="performer-item">
                <span class="performer-rank">{{ i + 1 }}</span>
                <div class="performer-avatar">
                  <mat-icon>person</mat-icon>
                </div>
                <div class="performer-info">
                  <span class="performer-name">{{ performer.name }}</span>
                  <span class="performer-role">{{ performer.role }}</span>
                </div>
                <div class="performer-stats">
                  <span class="performer-stat-value">{{ performer.stat }}</span>
                  <span class="performer-stat-label">{{ performer.statLabel }}</span>
                </div>
              </div>
            }
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
              <button class="action-btn" [style.--action-color]="action.color">
                <mat-icon>{{ action.icon }}</mat-icon>
                <span>{{ action.label }}</span>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1400px;
      margin: 0 auto;
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

    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      margin-top: 6px;
    }

    .stat-change mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .stat-change.positive {
      color: var(--color-success);
    }

    .stat-change.negative {
      color: var(--color-error);
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

    /* Recent Activity */
    .activity-list {
      padding: 12px 0;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 24px;
      transition: background 0.2s ease;
    }

    .activity-item:hover {
      background: var(--app-surface-alt);
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .activity-icon.match {
      background: #e6f7e6;
      color: var(--app-primary);
    }

    .activity-icon.member {
      background: #dbeafe;
      color: #3b82f6;
    }

    .activity-icon.practice {
      background: #fef3c7;
      color: #f59e0b;
    }

    .activity-icon.announcement {
      background: #fce7f3;
      color: #ec4899;
    }

    .activity-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .activity-title {
      font-weight: 500;
      color: var(--app-text);
      font-size: 14px;
    }

    .activity-description {
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .activity-time {
      font-size: 12px;
      color: var(--app-text-muted);
    }

    /* Top Performers */
    .performers-list {
      padding: 12px 0;
    }

    .performer-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 24px;
      transition: background 0.2s ease;
    }

    .performer-item:hover {
      background: var(--app-surface-alt);
    }

    .performer-rank {
      width: 24px;
      height: 24px;
      background: var(--app-surface-alt);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: var(--app-text-secondary);
    }

    .performer-item:first-child .performer-rank {
      background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
      color: white;
    }

    .performer-avatar {
      width: 40px;
      height: 40px;
      background: var(--app-surface-alt);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--app-text-secondary);
    }

    .performer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .performer-name {
      font-weight: 500;
      color: var(--app-text);
    }

    .performer-role {
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .performer-stats {
      text-align: right;
    }

    .performer-stat-value {
      display: block;
      font-family: 'Montserrat', sans-serif;
      font-size: 18px;
      font-weight: 700;
      color: var(--app-primary);
    }

    .performer-stat-label {
      font-size: 11px;
      color: var(--app-text-muted);
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
    }

    .action-btn:hover {
      background: #e6f7e6;
      color: var(--app-primary);
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
    }
  `]
})
export class DashboardComponent {
  stats: StatCard[] = [
    {
      title: 'Total Members',
      value: 156,
      icon: 'groups',
      change: '+12 this month',
      changeType: 'positive',
      color: '#2eb82e'
    },
    {
      title: 'Active Teams',
      value: 8,
      icon: 'group_work',
      change: '2 in tournament',
      changeType: 'neutral',
      color: '#3b82f6'
    },
    {
      title: 'Matches Won',
      value: 24,
      icon: 'emoji_events',
      change: '+3 this season',
      changeType: 'positive',
      color: '#ffc107'
    },
    {
      title: 'Practice Hours',
      value: 342,
      icon: 'fitness_center',
      change: '28 this week',
      changeType: 'positive',
      color: '#ec4899'
    },
  ];

  upcomingMatches = [
    { id: 1, day: '15', month: 'Jan', homeTeam: 'Fazi Lions', awayTeam: 'City Stars', venue: 'Central Stadium', time: '2:00 PM' },
    { id: 2, day: '18', month: 'Jan', homeTeam: 'Fazi Tigers', awayTeam: 'Metro XI', venue: 'Sports Complex', time: '10:00 AM' },
    { id: 3, day: '22', month: 'Jan', homeTeam: 'Fazi Eagles', awayTeam: 'United CC', venue: 'Green Park', time: '3:30 PM' },
  ];

  recentActivities: RecentActivity[] = [
    { icon: 'sports_score', title: 'Match Completed', description: 'Fazi Lions won against River XI', time: '2 hours ago', type: 'match' },
    { icon: 'person_add', title: 'New Member', description: 'John Smith joined the club', time: '5 hours ago', type: 'member' },
    { icon: 'fitness_center', title: 'Practice Session', description: 'Evening practice completed', time: 'Yesterday', type: 'practice' },
    { icon: 'campaign', title: 'Announcement', description: 'Tournament schedule released', time: '2 days ago', type: 'announcement' },
  ];

  topPerformers = [
    { name: 'Ahmed Khan', role: 'Batsman', stat: 487, statLabel: 'Runs' },
    { name: 'Raj Patel', role: 'Bowler', stat: 32, statLabel: 'Wickets' },
    { name: 'Mike Johnson', role: 'All-rounder', stat: 256, statLabel: 'Points' },
    { name: 'David Lee', role: 'Wicket Keeper', stat: 18, statLabel: 'Catches' },
  ];

  quickActions = [
    { label: 'Add Member', icon: 'person_add', color: '#2eb82e' },
    { label: 'Schedule Match', icon: 'event', color: '#3b82f6' },
    { label: 'Create Team', icon: 'group_add', color: '#ffc107' },
    { label: 'Send Notice', icon: 'mail', color: '#ec4899' },
  ];
}
