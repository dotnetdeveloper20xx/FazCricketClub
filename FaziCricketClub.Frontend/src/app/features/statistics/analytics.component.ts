import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { forkJoin } from 'rxjs';
import { StatsService } from '../../core/services/stats.service';
import { SeasonsService } from '../../core/services/seasons.service';
import { TeamsService } from '../../core/services/teams.service';
import { FixtureActivity, MemberActivity, Season, Team } from '../../shared/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Analytics</h1>
          <p class="page-description">Club activity trends and insights</p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading analytics...</p>
        </div>
      } @else {
        <!-- Summary Cards -->
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon matches">
              <mat-icon>sports_score</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ totalFixtures() }}</span>
              <span class="summary-label">Total Matches</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon members">
              <mat-icon>groups</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ totalMembers() }}</span>
              <span class="summary-label">Members Joined</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon peak">
              <mat-icon>trending_up</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ peakMonth() }}</span>
              <span class="summary-label">Most Active Month</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon avg">
              <mat-icon>analytics</mat-icon>
            </div>
            <div class="summary-content">
              <span class="summary-value">{{ avgMatchesPerMonth() }}</span>
              <span class="summary-label">Avg Matches/Month</span>
            </div>
          </div>
        </div>

        <!-- Fixture Activity Chart -->
        <div class="card chart-card">
          <div class="chart-header">
            <h2 class="chart-title">
              <mat-icon>sports_score</mat-icon>
              Match Activity Over Time
            </h2>
            <div class="chart-filters">
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Season</mat-label>
                <mat-select [(value)]="selectedSeasonId" (selectionChange)="loadFixtureActivity()">
                  <mat-option [value]="null">All Seasons</mat-option>
                  @for (season of seasons(); track season.id) {
                    <mat-option [value]="season.id">{{ season.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="filter-field">
                <mat-label>Team</mat-label>
                <mat-select [(value)]="selectedTeamId" (selectionChange)="loadFixtureActivity()">
                  <mat-option [value]="null">All Teams</mat-option>
                  @for (team of teams(); track team.id) {
                    <mat-option [value]="team.id">{{ team.name }}</mat-option>
                  }
                </mat-select>
              </mat-form-field>
            </div>
          </div>
          <div class="chart-container">
            @if (fixtureActivity().length === 0) {
              <div class="no-data">
                <mat-icon>bar_chart</mat-icon>
                <p>No match data available for the selected filters</p>
              </div>
            } @else {
              <div class="bar-chart">
                @for (item of fixtureActivity(); track item.period) {
                  <div class="bar-item">
                    <div class="bar-wrapper">
                      <div class="bar fixtures-bar"
                           [style.height.%]="getBarHeight(item.count, maxFixtureCount())"
                           [title]="item.count + ' matches'">
                        <span class="bar-value">{{ item.count }}</span>
                      </div>
                    </div>
                    <span class="bar-label">{{ formatPeriod(item.period) }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Member Activity Chart -->
        <div class="card chart-card">
          <div class="chart-header">
            <h2 class="chart-title">
              <mat-icon>person_add</mat-icon>
              Member Sign-ups Over Time
            </h2>
          </div>
          <div class="chart-container">
            @if (memberActivity().length === 0) {
              <div class="no-data">
                <mat-icon>bar_chart</mat-icon>
                <p>No member sign-up data available</p>
              </div>
            } @else {
              <div class="bar-chart">
                @for (item of memberActivity(); track item.period) {
                  <div class="bar-item">
                    <div class="bar-wrapper">
                      <div class="bar members-bar"
                           [style.height.%]="getBarHeight(item.count, maxMemberCount())"
                           [title]="item.count + ' members'">
                        <span class="bar-value">{{ item.count }}</span>
                      </div>
                    </div>
                    <span class="bar-label">{{ formatPeriod(item.period) }}</span>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <!-- Activity Comparison -->
        <div class="comparison-grid">
          <div class="card comparison-card">
            <h3 class="comparison-title">
              <mat-icon>calendar_month</mat-icon>
              Monthly Breakdown
            </h3>
            <div class="comparison-list">
              @for (item of fixtureActivity().slice(0, 6); track item.period) {
                <div class="comparison-item">
                  <span class="comparison-label">{{ formatPeriodFull(item.period) }}</span>
                  <div class="comparison-bar-container">
                    <div class="comparison-bar"
                         [style.width.%]="getBarHeight(item.count, maxFixtureCount())">
                    </div>
                  </div>
                  <span class="comparison-value">{{ item.count }}</span>
                </div>
              }
            </div>
          </div>

          <div class="card comparison-card">
            <h3 class="comparison-title">
              <mat-icon>insights</mat-icon>
              Quick Stats
            </h3>
            <div class="quick-stats">
              <div class="quick-stat">
                <span class="quick-stat-label">Total Months Tracked</span>
                <span class="quick-stat-value">{{ fixtureActivity().length }}</span>
              </div>
              <div class="quick-stat">
                <span class="quick-stat-label">Highest Match Count</span>
                <span class="quick-stat-value">{{ maxFixtureCount() }}</span>
              </div>
              <div class="quick-stat">
                <span class="quick-stat-label">Active Seasons</span>
                <span class="quick-stat-value">{{ seasons().length }}</span>
              </div>
              <div class="quick-stat">
                <span class="quick-stat-label">Registered Teams</span>
                <span class="quick-stat-value">{{ teams().length }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header {
      margin-bottom: 24px;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
    }

    /* Summary Cards */
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .summary-card {
      background: var(--app-surface);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .summary-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .summary-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: white;
    }

    .summary-icon.matches {
      background: linear-gradient(135deg, #2eb82e, #1c961c);
    }

    .summary-icon.members {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .summary-icon.peak {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .summary-icon.avg {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
    }

    .summary-content {
      display: flex;
      flex-direction: column;
    }

    .summary-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--app-text);
      line-height: 1;
    }

    .summary-label {
      font-size: 13px;
      color: var(--app-text-secondary);
      margin-top: 4px;
    }

    /* Chart Card */
    .chart-card {
      margin-bottom: 24px;
      padding: 0;
      overflow: hidden;
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      border-bottom: 1px solid var(--app-border);
      flex-wrap: wrap;
      gap: 16px;
    }

    .chart-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .chart-title mat-icon {
      color: var(--app-primary);
    }

    .chart-filters {
      display: flex;
      gap: 12px;
    }

    .filter-field {
      width: 150px;
    }

    .filter-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }

    .chart-container {
      padding: 24px;
      min-height: 300px;
    }

    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 250px;
      color: var(--app-text-secondary);
    }

    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.5;
      margin-bottom: 12px;
    }

    /* Bar Chart */
    .bar-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-around;
      height: 250px;
      gap: 8px;
      padding: 0 8px;
    }

    .bar-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      max-width: 60px;
    }

    .bar-wrapper {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .bar {
      width: 100%;
      max-width: 40px;
      border-radius: 6px 6px 0 0;
      position: relative;
      transition: height 0.3s ease;
      min-height: 4px;
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }

    .fixtures-bar {
      background: linear-gradient(180deg, #2eb82e, #1c961c);
    }

    .members-bar {
      background: linear-gradient(180deg, #1976d2, #1565c0);
    }

    .bar-value {
      position: absolute;
      top: -24px;
      font-size: 12px;
      font-weight: 600;
      color: var(--app-text);
    }

    .bar-label {
      font-size: 11px;
      color: var(--app-text-secondary);
      margin-top: 8px;
      text-align: center;
      white-space: nowrap;
    }

    /* Comparison Grid */
    .comparison-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
    }

    .comparison-card {
      padding: 20px 24px;
    }

    .comparison-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 20px;
    }

    .comparison-title mat-icon {
      color: var(--app-primary);
    }

    .comparison-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .comparison-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .comparison-label {
      width: 100px;
      font-size: 13px;
      color: var(--app-text-secondary);
      flex-shrink: 0;
    }

    .comparison-bar-container {
      flex: 1;
      height: 8px;
      background: var(--app-background);
      border-radius: 4px;
      overflow: hidden;
    }

    .comparison-bar {
      height: 100%;
      background: linear-gradient(90deg, #2eb82e, #1c961c);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .comparison-value {
      width: 40px;
      text-align: right;
      font-size: 14px;
      font-weight: 600;
      color: var(--app-text);
    }

    /* Quick Stats */
    .quick-stats {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .quick-stat {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .quick-stat-label {
      font-size: 14px;
      color: var(--app-text-secondary);
    }

    .quick-stat-value {
      font-size: 18px;
      font-weight: 600;
      color: var(--app-primary);
    }

    @media (max-width: 768px) {
      .chart-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .chart-filters {
        width: 100%;
      }

      .filter-field {
        flex: 1;
      }

      .bar-chart {
        overflow-x: auto;
        justify-content: flex-start;
      }

      .comparison-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  private statsService = inject(StatsService);
  private seasonsService = inject(SeasonsService);
  private teamsService = inject(TeamsService);

  // State
  isLoading = signal(false);
  fixtureActivity = signal<FixtureActivity[]>([]);
  memberActivity = signal<MemberActivity[]>([]);
  seasons = signal<Season[]>([]);
  teams = signal<Team[]>([]);

  // Filters
  selectedSeasonId: number | null = null;
  selectedTeamId: number | null = null;

  // Computed values
  totalFixtures = computed(() =>
    this.fixtureActivity().reduce((sum, item) => sum + item.count, 0)
  );

  totalMembers = computed(() =>
    this.memberActivity().reduce((sum, item) => sum + item.count, 0)
  );

  maxFixtureCount = computed(() =>
    Math.max(...this.fixtureActivity().map(item => item.count), 1)
  );

  maxMemberCount = computed(() =>
    Math.max(...this.memberActivity().map(item => item.count), 1)
  );

  peakMonth = computed(() => {
    const activities = this.fixtureActivity();
    if (activities.length === 0) return 'N/A';
    const peak = activities.reduce((max, item) => item.count > max.count ? item : max, activities[0]);
    return this.formatPeriod(peak.period);
  });

  avgMatchesPerMonth = computed(() => {
    const activities = this.fixtureActivity();
    if (activities.length === 0) return '0';
    const avg = this.totalFixtures() / activities.length;
    return avg.toFixed(1);
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      fixtureActivity: this.statsService.getFixtureActivity(),
      memberActivity: this.statsService.getMemberActivity(),
      seasons: this.seasonsService.getSeasons(),
      teams: this.teamsService.getTeams()
    }).subscribe({
      next: (results) => {
        this.fixtureActivity.set(results.fixtureActivity);
        this.memberActivity.set(results.memberActivity);
        this.seasons.set(results.seasons);
        this.teams.set(results.teams);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading analytics:', error);
        this.isLoading.set(false);
      }
    });
  }

  loadFixtureActivity(): void {
    const params: any = {};
    if (this.selectedSeasonId) params.seasonId = this.selectedSeasonId.toString();
    if (this.selectedTeamId) params.teamId = this.selectedTeamId.toString();

    this.statsService.getFixtureActivity(params).subscribe({
      next: (data) => this.fixtureActivity.set(data),
      error: (error) => console.error('Error loading fixture activity:', error)
    });
  }

  getBarHeight(value: number, max: number): number {
    if (max === 0) return 0;
    return Math.max((value / max) * 100, 5);
  }

  formatPeriod(period: string): string {
    // Period format is typically "YYYY-MM"
    const [year, month] = period.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIndex = parseInt(month, 10) - 1;
    return monthNames[monthIndex] || period;
  }

  formatPeriodFull(period: string): string {
    const [year, month] = period.split('-');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} ${year}`;
  }
}
