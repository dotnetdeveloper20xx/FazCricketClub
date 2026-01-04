import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { FixturesService } from '../../core/services/fixtures.service';
import { TeamsService } from '../../core/services/teams.service';
import { SeasonsService } from '../../core/services/seasons.service';
import { Fixture, Team, Season, PaginatedResponse, FixtureStatus } from '../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTabsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Matches</h1>
          <p class="page-description">View and manage cricket matches</p>
        </div>
        <button class="btn btn-primary" (click)="openFixtureDialog()">
          <mat-icon>add_circle</mat-icon>
          Schedule Match
        </button>
      </div>

      <!-- Filters -->
      <div class="card filters-card">
        <div class="filters-row">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Status</mat-label>
            <mat-select [value]="statusFilter()" (selectionChange)="onStatusChange($event.value)">
              <mat-option value="">All</mat-option>
              <mat-option value="Scheduled">Scheduled</mat-option>
              <mat-option value="InProgress">In Progress</mat-option>
              <mat-option value="Completed">Completed</mat-option>
              <mat-option value="Cancelled">Cancelled</mat-option>
              <mat-option value="Postponed">Postponed</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Season</mat-label>
            <mat-select [value]="seasonFilter()" (selectionChange)="onSeasonChange($event.value)">
              <mat-option value="">All Seasons</mat-option>
              @for (season of seasons(); track season.id) {
                <mat-option [value]="season.id">{{ season.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Team</mat-label>
            <mat-select [value]="teamFilter()" (selectionChange)="onTeamChange($event.value)">
              <mat-option value="">All Teams</mat-option>
              @for (team of teams(); track team.id) {
                <mat-option [value]="team.id">{{ team.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <!-- Fixtures List -->
      <div class="card table-card">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading matches...</p>
          </div>
        } @else if (fixtures().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">sports_cricket</mat-icon>
            <h3>No matches found</h3>
            <p>{{ statusFilter() || seasonFilter() || teamFilter() ? 'Try adjusting your filters' : 'Get started by scheduling your first match' }}</p>
            @if (!statusFilter() && !seasonFilter() && !teamFilter()) {
              <button class="btn btn-primary" (click)="openFixtureDialog()">
                <mat-icon>add_circle</mat-icon>
                Schedule Match
              </button>
            }
          </div>
        } @else {
          <div class="fixtures-list">
            @for (fixture of fixtures(); track fixture.id) {
              <div class="fixture-card" [class]="'status-' + fixture.status.toLowerCase()">
                <div class="fixture-date">
                  <div class="date-day">{{ fixture.startDateTime | date:'dd' }}</div>
                  <div class="date-month">{{ fixture.startDateTime | date:'MMM' }}</div>
                  <div class="date-time">{{ fixture.startDateTime | date:'HH:mm' }}</div>
                </div>
                <div class="fixture-details">
                  <div class="fixture-teams">
                    <span class="team home">{{ fixture.homeTeamName || 'TBD' }}</span>
                    <span class="vs">vs</span>
                    <span class="team away">{{ fixture.awayTeamName || 'TBD' }}</span>
                  </div>
                  <div class="fixture-meta">
                    <span class="venue"><mat-icon>location_on</mat-icon> {{ fixture.venue }}</span>
                    @if (fixture.competitionName) {
                      <span class="competition"><mat-icon>emoji_events</mat-icon> {{ fixture.competitionName }}</span>
                    }
                    @if (fixture.seasonName) {
                      <span class="season"><mat-icon>calendar_today</mat-icon> {{ fixture.seasonName }}</span>
                    }
                  </div>
                  @if (fixture.matchResult) {
                    <div class="fixture-result">
                      <span class="score">{{ fixture.matchResult.homeTeamRuns }}/{{ fixture.matchResult.homeTeamWickets }}</span>
                      <span class="overs">({{ fixture.matchResult.homeTeamOvers }} ov)</span>
                      <span class="dash">-</span>
                      <span class="score">{{ fixture.matchResult.awayTeamRuns }}/{{ fixture.matchResult.awayTeamWickets }}</span>
                      <span class="overs">({{ fixture.matchResult.awayTeamOvers }} ov)</span>
                    </div>
                  }
                </div>
                <div class="fixture-status">
                  <span class="status-badge" [class]="fixture.status.toLowerCase()">
                    {{ getStatusLabel(fixture.status) }}
                  </span>
                </div>
                <div class="fixture-actions">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="openFixtureDialog(fixture)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    @if (fixture.status === 'Completed' || fixture.status === 'InProgress') {
                      <button mat-menu-item (click)="openResultDialog(fixture)">
                        <mat-icon>scoreboard</mat-icon>
                        <span>{{ fixture.matchResult ? 'Edit Result' : 'Add Result' }}</span>
                      </button>
                    }
                    <button mat-menu-item class="delete-action" (click)="deleteFixture(fixture)">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </div>
              </div>
            }
          </div>

          <mat-paginator
            [length]="totalCount()"
            [pageSize]="pageSize()"
            [pageIndex]="pageNumber() - 1"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        }
      </div>

      <!-- Fixture Dialog (Create/Edit) -->
      @if (showFixtureDialog()) {
        <div class="dialog-overlay" (click)="closeFixtureDialog()">
          <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingFixture() ? 'Edit Match' : 'Schedule New Match' }}</h2>
              <button mat-icon-button (click)="closeFixtureDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form [formGroup]="fixtureForm" (ngSubmit)="saveFixture()">
              <div class="dialog-body">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Home Team</mat-label>
                    <mat-select formControlName="homeTeamId">
                      @for (team of teams(); track team.id) {
                        <mat-option [value]="team.id">{{ team.name }}</mat-option>
                      }
                    </mat-select>
                    @if (fixtureForm.get('homeTeamId')?.hasError('required') && fixtureForm.get('homeTeamId')?.touched) {
                      <mat-error>Home team is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Away Team</mat-label>
                    <mat-select formControlName="awayTeamId">
                      @for (team of teams(); track team.id) {
                        <mat-option [value]="team.id">{{ team.name }}</mat-option>
                      }
                    </mat-select>
                    @if (fixtureForm.get('awayTeamId')?.hasError('required') && fixtureForm.get('awayTeamId')?.touched) {
                      <mat-error>Away team is required</mat-error>
                    }
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Season</mat-label>
                  <mat-select formControlName="seasonId">
                    @for (season of seasons(); track season.id) {
                      <mat-option [value]="season.id">{{ season.name }}</mat-option>
                    }
                  </mat-select>
                  @if (fixtureForm.get('seasonId')?.hasError('required') && fixtureForm.get('seasonId')?.touched) {
                    <mat-error>Season is required</mat-error>
                  }
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Date & Time</mat-label>
                    <input matInput formControlName="startDateTime" type="datetime-local">
                    @if (fixtureForm.get('startDateTime')?.hasError('required') && fixtureForm.get('startDateTime')?.touched) {
                      <mat-error>Date & time is required</mat-error>
                    }
                  </mat-form-field>

                  @if (editingFixture()) {
                    <mat-form-field appearance="outline" class="half-width">
                      <mat-label>Status</mat-label>
                      <mat-select formControlName="status">
                        <mat-option value="Scheduled">Scheduled</mat-option>
                        <mat-option value="InProgress">In Progress</mat-option>
                        <mat-option value="Completed">Completed</mat-option>
                        <mat-option value="Cancelled">Cancelled</mat-option>
                        <mat-option value="Postponed">Postponed</mat-option>
                      </mat-select>
                    </mat-form-field>
                  }
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Venue</mat-label>
                  <input matInput formControlName="venue" placeholder="Enter venue name">
                  @if (fixtureForm.get('venue')?.hasError('required') && fixtureForm.get('venue')?.touched) {
                    <mat-error>Venue is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Competition Name</mat-label>
                  <input matInput formControlName="competitionName" placeholder="e.g., League Match, Cup Final (optional)">
                </mat-form-field>
              </div>
              <div class="dialog-footer">
                <button mat-stroked-button type="button" (click)="closeFixtureDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="fixtureForm.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    {{ editingFixture() ? 'Update' : 'Schedule' }}
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Result Dialog -->
      @if (showResultDialog()) {
        <div class="dialog-overlay" (click)="closeResultDialog()">
          <div class="dialog-content dialog-large" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ resultFixture()?.matchResult ? 'Edit Match Result' : 'Add Match Result' }}</h2>
              <button mat-icon-button (click)="closeResultDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form [formGroup]="resultForm" (ngSubmit)="saveResult()">
              <div class="dialog-body">
                <h3 class="team-heading">{{ resultFixture()?.homeTeamName }} (Home)</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Runs</mat-label>
                    <input matInput formControlName="homeTeamRuns" type="number" min="0">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Wickets</mat-label>
                    <input matInput formControlName="homeTeamWickets" type="number" min="0" max="10">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Overs</mat-label>
                    <input matInput formControlName="homeTeamOvers" type="number" min="0" step="0.1">
                  </mat-form-field>
                </div>

                <h3 class="team-heading">{{ resultFixture()?.awayTeamName }} (Away)</h3>
                <div class="form-row">
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Runs</mat-label>
                    <input matInput formControlName="awayTeamRuns" type="number" min="0">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Wickets</mat-label>
                    <input matInput formControlName="awayTeamWickets" type="number" min="0" max="10">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="third-width">
                    <mat-label>Overs</mat-label>
                    <input matInput formControlName="awayTeamOvers" type="number" min="0" step="0.1">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Result Summary</mat-label>
                  <input matInput formControlName="resultSummary" placeholder="e.g., Home team won by 25 runs">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Notes</mat-label>
                  <textarea matInput formControlName="notes" rows="3" placeholder="Additional notes (optional)"></textarea>
                </mat-form-field>
              </div>
              <div class="dialog-footer">
                <button mat-stroked-button type="button" (click)="closeResultDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="resultForm.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    Save Result
                  }
                </button>
              </div>
            </form>
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

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filters-card {
      margin-bottom: 16px;
      padding: 16px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .filter-field {
      min-width: 180px;
    }

    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .loading-container,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--app-primary);
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px;
    }

    .empty-state p {
      margin: 0 0 16px;
      color: var(--app-text-secondary);
    }

    .fixtures-list {
      padding: 16px;
    }

    .fixture-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 16px;
      border-radius: 8px;
      background: var(--app-background);
      margin-bottom: 12px;
      border-left: 4px solid var(--app-primary);
    }

    .fixture-card.status-completed {
      border-left-color: #4caf50;
    }

    .fixture-card.status-inprogress {
      border-left-color: #ff9800;
    }

    .fixture-card.status-cancelled {
      border-left-color: #f44336;
    }

    .fixture-card.status-postponed {
      border-left-color: #9e9e9e;
    }

    .fixture-date {
      text-align: center;
      min-width: 60px;
    }

    .date-day {
      font-size: 24px;
      font-weight: 700;
      line-height: 1;
    }

    .date-month {
      font-size: 12px;
      text-transform: uppercase;
      color: var(--app-text-secondary);
    }

    .date-time {
      font-size: 12px;
      color: var(--app-primary);
      margin-top: 4px;
    }

    .fixture-details {
      flex: 1;
    }

    .fixture-teams {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .vs {
      color: var(--app-text-secondary);
      margin: 0 8px;
      font-weight: 400;
    }

    .fixture-meta {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .fixture-meta span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .fixture-meta mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .fixture-result {
      margin-top: 8px;
      font-size: 14px;
      font-weight: 600;
      color: var(--app-primary);
    }

    .fixture-result .overs {
      font-weight: 400;
      color: var(--app-text-secondary);
    }

    .fixture-result .dash {
      margin: 0 8px;
      color: var(--app-text-secondary);
    }

    .fixture-status {
      min-width: 100px;
      text-align: center;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-badge.scheduled {
      background: rgba(33, 150, 243, 0.15);
      color: #1976d2;
    }

    .status-badge.inprogress {
      background: rgba(255, 152, 0, 0.15);
      color: #f57c00;
    }

    .status-badge.completed {
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .status-badge.cancelled {
      background: rgba(244, 67, 54, 0.15);
      color: #d32f2f;
    }

    .status-badge.postponed {
      background: rgba(158, 158, 158, 0.15);
      color: #616161;
    }

    .delete-action {
      color: #f44336;
    }

    /* Dialog Styles */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: var(--app-surface);
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .dialog-large {
      max-width: 600px;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--app-border);
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
    }

    .dialog-body {
      padding: 24px;
      overflow-y: auto;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--app-border);
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .half-width {
      width: calc(50% - 8px);
    }

    .third-width {
      width: calc(33.333% - 10px);
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    .team-heading {
      font-size: 14px;
      font-weight: 600;
      margin: 16px 0 8px;
      color: var(--app-text-secondary);
    }

    .team-heading:first-child {
      margin-top: 0;
    }

    mat-paginator {
      border-top: 1px solid var(--app-border);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-row {
        flex-direction: column;
      }

      .filter-field {
        width: 100%;
      }

      .fixture-card {
        flex-direction: column;
        align-items: flex-start;
      }

      .fixture-date {
        display: flex;
        gap: 8px;
        align-items: baseline;
      }

      .form-row {
        flex-direction: column;
      }

      .half-width,
      .third-width {
        width: 100%;
      }
    }
  `]
})
export class MatchesListComponent implements OnInit {
  private fixturesService = inject(FixturesService);
  private teamsService = inject(TeamsService);
  private seasonsService = inject(SeasonsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // Data
  fixtures = signal<Fixture[]>([]);
  teams = signal<Team[]>([]);
  seasons = signal<Season[]>([]);
  totalCount = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);

  // Filters
  statusFilter = signal<string>('');
  seasonFilter = signal<string>('');
  teamFilter = signal<string>('');

  // UI State
  isLoading = signal(false);
  isSaving = signal(false);
  showFixtureDialog = signal(false);
  showResultDialog = signal(false);
  editingFixture = signal<Fixture | null>(null);
  resultFixture = signal<Fixture | null>(null);

  fixtureForm: FormGroup = this.fb.group({
    homeTeamId: ['', Validators.required],
    awayTeamId: ['', Validators.required],
    seasonId: ['', Validators.required],
    startDateTime: ['', Validators.required],
    venue: ['', Validators.required],
    competitionName: [''],
    status: ['Scheduled']
  });

  resultForm: FormGroup = this.fb.group({
    homeTeamRuns: [0, [Validators.required, Validators.min(0)]],
    homeTeamWickets: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    homeTeamOvers: [0, [Validators.required, Validators.min(0)]],
    awayTeamRuns: [0, [Validators.required, Validators.min(0)]],
    awayTeamWickets: [0, [Validators.required, Validators.min(0), Validators.max(10)]],
    awayTeamOvers: [0, [Validators.required, Validators.min(0)]],
    resultSummary: [''],
    notes: ['']
  });

  ngOnInit(): void {
    this.loadReferenceData();
    this.loadFixtures();
  }

  loadReferenceData(): void {
    forkJoin({
      teams: this.teamsService.getTeams(),
      seasons: this.seasonsService.getSeasons()
    }).subscribe({
      next: ({ teams, seasons }) => {
        this.teams.set(teams.filter(t => t.isActive));
        this.seasons.set(seasons);
      },
      error: (error) => {
        console.error('Error loading reference data:', error);
      }
    });
  }

  loadFixtures(): void {
    this.isLoading.set(true);

    const params: any = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    };

    if (this.statusFilter()) {
      params.status = this.statusFilter();
    }
    if (this.seasonFilter()) {
      params.seasonId = this.seasonFilter();
    }
    if (this.teamFilter()) {
      params.teamId = this.teamFilter();
    }

    this.fixturesService.getFixtures(params).subscribe({
      next: (response: PaginatedResponse<Fixture>) => {
        this.fixtures.set(response.items);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading fixtures:', error);
        this.snackBar.open('Failed to load matches', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  onStatusChange(status: string): void {
    this.statusFilter.set(status);
    this.pageNumber.set(1);
    this.loadFixtures();
  }

  onSeasonChange(seasonId: string): void {
    this.seasonFilter.set(seasonId);
    this.pageNumber.set(1);
    this.loadFixtures();
  }

  onTeamChange(teamId: string): void {
    this.teamFilter.set(teamId);
    this.pageNumber.set(1);
    this.loadFixtures();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadFixtures();
  }

  getStatusLabel(status: FixtureStatus): string {
    const labels: Record<FixtureStatus, string> = {
      'Scheduled': 'Scheduled',
      'InProgress': 'In Progress',
      'Completed': 'Completed',
      'Cancelled': 'Cancelled',
      'Postponed': 'Postponed'
    };
    return labels[status] || status;
  }

  openFixtureDialog(fixture?: Fixture): void {
    this.editingFixture.set(fixture || null);
    if (fixture) {
      const dateTime = new Date(fixture.startDateTime);
      const localDateTime = dateTime.toISOString().slice(0, 16);
      this.fixtureForm.patchValue({
        homeTeamId: fixture.homeTeamId,
        awayTeamId: fixture.awayTeamId,
        seasonId: fixture.seasonId,
        startDateTime: localDateTime,
        venue: fixture.venue,
        competitionName: fixture.competitionName || '',
        status: fixture.status
      });
    } else {
      this.fixtureForm.reset({ status: 'Scheduled' });
    }
    this.showFixtureDialog.set(true);
  }

  closeFixtureDialog(): void {
    this.showFixtureDialog.set(false);
    this.editingFixture.set(null);
    this.fixtureForm.reset({ status: 'Scheduled' });
  }

  saveFixture(): void {
    if (this.fixtureForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.fixtureForm.value;

    const fixtureData = {
      homeTeamId: formValue.homeTeamId,
      awayTeamId: formValue.awayTeamId,
      seasonId: formValue.seasonId,
      startDateTime: new Date(formValue.startDateTime).toISOString(),
      venue: formValue.venue,
      competitionName: formValue.competitionName || undefined
    };

    const editing = this.editingFixture();

    if (editing) {
      this.fixturesService.updateFixture(editing.id, { ...fixtureData, status: formValue.status }).subscribe({
        next: () => {
          this.snackBar.open('Match updated successfully', 'Close', { duration: 3000 });
          this.closeFixtureDialog();
          this.loadFixtures();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error updating fixture:', error);
          this.snackBar.open('Failed to update match', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    } else {
      this.fixturesService.createFixture(fixtureData).subscribe({
        next: () => {
          this.snackBar.open('Match scheduled successfully', 'Close', { duration: 3000 });
          this.closeFixtureDialog();
          this.loadFixtures();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error creating fixture:', error);
          this.snackBar.open('Failed to schedule match', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteFixture(fixture: Fixture): void {
    if (confirm(`Are you sure you want to delete this match?`)) {
      this.fixturesService.deleteFixture(fixture.id).subscribe({
        next: () => {
          this.snackBar.open('Match deleted successfully', 'Close', { duration: 3000 });
          this.loadFixtures();
        },
        error: (error) => {
          console.error('Error deleting fixture:', error);
          this.snackBar.open('Failed to delete match', 'Close', { duration: 3000 });
        }
      });
    }
  }

  openResultDialog(fixture: Fixture): void {
    this.resultFixture.set(fixture);
    if (fixture.matchResult) {
      this.resultForm.patchValue({
        homeTeamRuns: fixture.matchResult.homeTeamRuns,
        homeTeamWickets: fixture.matchResult.homeTeamWickets,
        homeTeamOvers: fixture.matchResult.homeTeamOvers,
        awayTeamRuns: fixture.matchResult.awayTeamRuns,
        awayTeamWickets: fixture.matchResult.awayTeamWickets,
        awayTeamOvers: fixture.matchResult.awayTeamOvers,
        resultSummary: fixture.matchResult.resultSummary || '',
        notes: fixture.matchResult.notes || ''
      });
    } else {
      this.resultForm.reset({
        homeTeamRuns: 0,
        homeTeamWickets: 0,
        homeTeamOvers: 0,
        awayTeamRuns: 0,
        awayTeamWickets: 0,
        awayTeamOvers: 0
      });
    }
    this.showResultDialog.set(true);
  }

  closeResultDialog(): void {
    this.showResultDialog.set(false);
    this.resultFixture.set(null);
    this.resultForm.reset();
  }

  saveResult(): void {
    if (this.resultForm.invalid) return;

    const fixture = this.resultFixture();
    if (!fixture) return;

    this.isSaving.set(true);
    const formValue = this.resultForm.value;

    const resultData = {
      fixtureId: fixture.id,
      homeTeamRuns: formValue.homeTeamRuns,
      homeTeamWickets: formValue.homeTeamWickets,
      homeTeamOvers: formValue.homeTeamOvers,
      awayTeamRuns: formValue.awayTeamRuns,
      awayTeamWickets: formValue.awayTeamWickets,
      awayTeamOvers: formValue.awayTeamOvers,
      resultSummary: formValue.resultSummary || undefined,
      notes: formValue.notes || undefined
    };

    this.fixturesService.saveMatchResult(fixture.id, resultData).subscribe({
      next: () => {
        this.snackBar.open('Match result saved successfully', 'Close', { duration: 3000 });
        this.closeResultDialog();
        this.loadFixtures();
        this.isSaving.set(false);
      },
      error: (error) => {
        console.error('Error saving match result:', error);
        this.snackBar.open('Failed to save match result', 'Close', { duration: 3000 });
        this.isSaving.set(false);
      }
    });
  }
}
