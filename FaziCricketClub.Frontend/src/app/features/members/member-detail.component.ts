import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MembersService } from '../../core/services/members.service';
import { StatsService } from '../../core/services/stats.service';
import { Member, BattingStats, BowlingStats } from '../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <!-- Back Navigation -->
      <div class="back-nav">
        <a routerLink="/members" class="back-link">
          <mat-icon>arrow_back</mat-icon>
          <span>Back to Members</span>
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading member details...</p>
        </div>
      } @else if (!member()) {
        <div class="card error-state">
          <mat-icon class="error-icon">person_off</mat-icon>
          <h2>Member Not Found</h2>
          <p>The requested member could not be found.</p>
          <a mat-raised-button color="primary" routerLink="/members">
            Return to Members
          </a>
        </div>
      } @else {
        <!-- Member Header -->
        <div class="card member-header">
          <div class="member-avatar" [class.inactive]="!member()!.isActive">
            <span>{{ getInitials(member()!.fullName) }}</span>
          </div>
          <div class="member-info">
            <div class="member-name-row">
              <h1 class="member-name">{{ member()!.fullName }}</h1>
              <span class="status-chip" [class.active]="member()!.isActive" [class.inactive]="!member()!.isActive">
                {{ member()!.isActive ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="member-meta">
              <span class="meta-item">
                <mat-icon>email</mat-icon>
                {{ member()!.email }}
              </span>
              @if (member()!.phoneNumber) {
                <span class="meta-item">
                  <mat-icon>phone</mat-icon>
                  {{ member()!.phoneNumber }}
                </span>
              }
              @if (member()!.dateOfBirth) {
                <span class="meta-item">
                  <mat-icon>cake</mat-icon>
                  {{ member()!.dateOfBirth | date:'MMM d, yyyy' }}
                </span>
              }
              <span class="meta-item">
                <mat-icon>calendar_today</mat-icon>
                Joined {{ member()!.joinedOn | date:'MMM yyyy' }}
              </span>
            </div>
          </div>
          <div class="header-actions">
            <a mat-raised-button color="primary" [routerLink]="['/statistics/player', member()!.id]">
              <mat-icon>bar_chart</mat-icon>
              Full Statistics
            </a>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon batting">
              <mat-icon>sports_cricket</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ battingStats()?.runs || 0 }}</span>
              <span class="stat-label">Total Runs</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bowling">
              <mat-icon>sports_baseball</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ bowlingStats()?.wickets || 0 }}</span>
              <span class="stat-label">Wickets</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon matches">
              <mat-icon>event</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ battingStats()?.matches || bowlingStats()?.matches || 0 }}</span>
              <span class="stat-label">Matches</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon average">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ (battingStats()?.average || 0) | number:'1.2-2' }}</span>
              <span class="stat-label">Batting Avg</span>
            </div>
          </div>
        </div>

        <!-- Detailed Stats -->
        <div class="stats-panels">
          <!-- Batting Panel -->
          <div class="card stats-panel">
            <div class="panel-header batting">
              <mat-icon>sports_cricket</mat-icon>
              <h3>Batting Performance</h3>
            </div>
            <div class="panel-body">
              @if (battingStats()) {
                <div class="stats-table">
                  <div class="stat-row">
                    <span class="stat-name">Matches</span>
                    <span class="stat-val">{{ battingStats()!.matches }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Innings</span>
                    <span class="stat-val">{{ battingStats()!.innings }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Runs</span>
                    <span class="stat-val highlight">{{ battingStats()!.runs }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Not Outs</span>
                    <span class="stat-val">{{ battingStats()!.notOuts }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Highest Score</span>
                    <span class="stat-val">{{ battingStats()!.highestScore }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Average</span>
                    <span class="stat-val">{{ battingStats()!.average | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Strike Rate</span>
                    <span class="stat-val">{{ battingStats()!.strikeRate | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">50s / 100s</span>
                    <span class="stat-val">{{ battingStats()!.fifties }} / {{ battingStats()!.hundreds }}</span>
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

          <!-- Bowling Panel -->
          <div class="card stats-panel">
            <div class="panel-header bowling">
              <mat-icon>sports_baseball</mat-icon>
              <h3>Bowling Performance</h3>
            </div>
            <div class="panel-body">
              @if (bowlingStats()) {
                <div class="stats-table">
                  <div class="stat-row">
                    <span class="stat-name">Matches</span>
                    <span class="stat-val">{{ bowlingStats()!.matches }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Innings</span>
                    <span class="stat-val">{{ bowlingStats()!.innings }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Overs</span>
                    <span class="stat-val">{{ bowlingStats()!.overs | number:'1.1-1' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Wickets</span>
                    <span class="stat-val highlight">{{ bowlingStats()!.wickets }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Runs Conceded</span>
                    <span class="stat-val">{{ bowlingStats()!.runs }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Best Figures</span>
                    <span class="stat-val">{{ bowlingStats()!.bestFigures || '-' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Average</span>
                    <span class="stat-val">{{ bowlingStats()!.average | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">Economy</span>
                    <span class="stat-val">{{ bowlingStats()!.economy | number:'1.2-2' }}</span>
                  </div>
                  <div class="stat-row">
                    <span class="stat-name">5 Wickets</span>
                    <span class="stat-val">{{ bowlingStats()!.fiveWickets }}</span>
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

        <!-- Notes -->
        @if (member()!.notes) {
          <div class="card notes-card">
            <h3><mat-icon>notes</mat-icon> Notes</h3>
            <p>{{ member()!.notes }}</p>
          </div>
        }
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

    .member-header {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .member-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--app-primary), #1c961c);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .member-avatar.inactive {
      background: linear-gradient(135deg, #9e9e9e, #757575);
    }

    .member-info {
      flex: 1;
    }

    .member-name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }

    .member-name {
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

    .member-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
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

    .header-actions {
      flex-shrink: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
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

    .stat-icon.batting {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .stat-icon.bowling {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .stat-icon.matches {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .stat-icon.average {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
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

    .stats-panels {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 24px;
    }

    .stats-panel {
      padding: 0;
      overflow: hidden;
    }

    .panel-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      color: white;
    }

    .panel-header.batting {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .panel-header.bowling {
      background: linear-gradient(135deg, #388e3c, #2e7d32);
    }

    .panel-header mat-icon {
      font-size: 24px;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }

    .panel-body {
      padding: 20px;
    }

    .stats-table {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .stat-name {
      color: var(--app-text-secondary);
      font-size: 14px;
    }

    .stat-val {
      font-weight: 600;
      font-size: 15px;
    }

    .stat-val.highlight {
      color: var(--app-primary);
      font-size: 18px;
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

    .notes-card {
      padding: 20px;
    }

    .notes-card h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 0 12px;
      font-size: 16px;
    }

    .notes-card p {
      margin: 0;
      color: var(--app-text-secondary);
      line-height: 1.6;
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .stats-panels {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .member-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }

      .member-name-row {
        flex-direction: column;
      }

      .member-meta {
        justify-content: center;
      }

      .stats-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 480px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MemberDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private membersService = inject(MembersService);
  private statsService = inject(StatsService);

  member = signal<Member | null>(null);
  battingStats = signal<BattingStats | null>(null);
  bowlingStats = signal<BowlingStats | null>(null);
  isLoading = signal(false);

  private memberId = '';

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('id') || '';
    if (this.memberId) {
      this.loadData();
    }
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      member: this.membersService.getMember(this.memberId),
      batting: this.statsService.getPlayerBattingStats(this.memberId),
      bowling: this.statsService.getPlayerBowlingStats(this.memberId)
    }).subscribe({
      next: ({ member, batting, bowling }) => {
        this.member.set(member);
        this.battingStats.set(batting);
        this.bowlingStats.set(bowling);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading member data:', error);
        this.isLoading.set(false);
      }
    });
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
