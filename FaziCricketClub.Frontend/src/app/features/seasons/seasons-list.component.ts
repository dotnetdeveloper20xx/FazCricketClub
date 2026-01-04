import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { SeasonsService } from '../../core/services/seasons.service';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { Season, CreateSeasonRequest } from '../../shared/models';

@Component({
  selector: 'app-seasons-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Seasons</h1>
          <p class="page-description">Manage cricket seasons and competitions</p>
        </div>
        <button class="btn btn-primary" (click)="openDialog()">
          <mat-icon>add_circle</mat-icon>
          Add Season
        </button>
      </div>

      @if (isLoading()) {
        <div class="card loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading seasons...</p>
        </div>
      } @else if (seasons().length === 0) {
        <div class="card empty-state">
          <mat-icon class="empty-icon">date_range</mat-icon>
          <h3>No seasons found</h3>
          <p>Get started by creating your first season</p>
          <button class="btn btn-primary" (click)="openDialog()">
            <mat-icon>add_circle</mat-icon>
            Add Season
          </button>
        </div>
      } @else {
        <div class="seasons-grid">
          @for (season of seasons(); track season.id) {
            <div class="season-card card" [class.current]="isCurrentSeason(season)">
              <div class="season-header">
                <div class="season-icon" [class.active]="isCurrentSeason(season)">
                  <mat-icon>{{ isCurrentSeason(season) ? 'sports_cricket' : 'calendar_today' }}</mat-icon>
                </div>
                <div class="season-info">
                  <h3 class="season-name">{{ season.name }}</h3>
                  @if (isCurrentSeason(season)) {
                    <span class="current-badge">Current Season</span>
                  }
                </div>
                <button mat-icon-button [matMenuTriggerFor]="menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="openDialog(season)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item class="delete-action" (click)="deleteSeason(season)">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </div>

              <div class="season-body">
                <div class="date-range">
                  <div class="date-item">
                    <mat-icon>event</mat-icon>
                    <div class="date-info">
                      <span class="date-label">Start</span>
                      <span class="date-value">{{ season.startDate | date:'MMM d, yyyy' }}</span>
                    </div>
                  </div>
                  <div class="date-separator">
                    <mat-icon>arrow_forward</mat-icon>
                  </div>
                  <div class="date-item">
                    <mat-icon>event</mat-icon>
                    <div class="date-info">
                      <span class="date-label">End</span>
                      <span class="date-value">{{ season.endDate | date:'MMM d, yyyy' }}</span>
                    </div>
                  </div>
                </div>

                @if (season.description) {
                  <p class="season-description">{{ season.description }}</p>
                }

                <div class="season-status">
                  <span class="status-chip" [class]="getSeasonStatus(season)">
                    {{ getSeasonStatusLabel(season) }}
                  </span>
                  <span class="duration">{{ getSeasonDuration(season) }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Season Dialog -->
      @if (showDialog()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingSeason() ? 'Edit Season' : 'Add New Season' }}</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form [formGroup]="seasonForm" (ngSubmit)="saveSeason()">
              <div class="dialog-body">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Season Name</mat-label>
                  <input matInput formControlName="name" placeholder="e.g., Summer 2024">
                  @if (seasonForm.get('name')?.hasError('required') && seasonForm.get('name')?.touched) {
                    <mat-error>Season name is required</mat-error>
                  }
                </mat-form-field>

                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Start Date</mat-label>
                    <input matInput formControlName="startDate" type="date">
                    @if (seasonForm.get('startDate')?.hasError('required') && seasonForm.get('startDate')?.touched) {
                      <mat-error>Start date is required</mat-error>
                    }
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>End Date</mat-label>
                    <input matInput formControlName="endDate" type="date">
                    @if (seasonForm.get('endDate')?.hasError('required') && seasonForm.get('endDate')?.touched) {
                      <mat-error>End date is required</mat-error>
                    }
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="3"
                            placeholder="Optional description for this season"></textarea>
                </mat-form-field>
              </div>
              <div class="dialog-footer">
                <button mat-stroked-button type="button" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit"
                        [disabled]="seasonForm.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    {{ editingSeason() ? 'Update' : 'Create' }}
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

    .seasons-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
    }

    .season-card {
      padding: 0;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .season-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-card-hover);
    }

    .season-card.current {
      border: 2px solid var(--app-primary);
    }

    .season-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: var(--app-background);
      border-bottom: 1px solid var(--app-border);
    }

    .season-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--app-surface-alt);
      color: var(--app-text-secondary);
    }

    .season-icon.active {
      background: linear-gradient(135deg, var(--app-primary), #1c961c);
      color: white;
    }

    .season-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .season-info {
      flex: 1;
    }

    .season-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .current-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      color: var(--app-primary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .season-body {
      padding: 20px;
    }

    .date-range {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .date-item {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .date-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
      color: var(--app-text-secondary);
    }

    .date-info {
      display: flex;
      flex-direction: column;
    }

    .date-label {
      font-size: 11px;
      color: var(--app-text-secondary);
      text-transform: uppercase;
    }

    .date-value {
      font-size: 14px;
      font-weight: 500;
    }

    .date-separator {
      color: var(--app-text-muted);
    }

    .date-separator mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .season-description {
      font-size: 14px;
      color: var(--app-text-secondary);
      margin: 0 0 16px;
      line-height: 1.5;
    }

    .season-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 16px;
      border-top: 1px solid var(--app-border);
    }

    .status-chip {
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-chip.active {
      background: rgba(46, 184, 46, 0.15);
      color: #1c961c;
    }

    .status-chip.upcoming {
      background: rgba(33, 150, 243, 0.15);
      color: #1976d2;
    }

    .status-chip.completed {
      background: rgba(158, 158, 158, 0.15);
      color: #616161;
    }

    .duration {
      font-size: 13px;
      color: var(--app-text-secondary);
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

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 8px;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .seasons-grid {
        grid-template-columns: 1fr;
      }

      .form-row {
        flex-direction: column;
      }

      .half-width {
        width: 100%;
      }

      .date-range {
        flex-direction: column;
        gap: 12px;
      }

      .date-separator {
        transform: rotate(90deg);
      }
    }
  `]
})
export class SeasonsListComponent implements OnInit {
  private seasonsService = inject(SeasonsService);
  private confirmDialog = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // State
  seasons = signal<Season[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  showDialog = signal(false);
  editingSeason = signal<Season | null>(null);

  seasonForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    this.loadSeasons();
  }

  loadSeasons(): void {
    this.isLoading.set(true);
    this.seasonsService.getSeasons().subscribe({
      next: (seasons) => {
        // Sort by start date descending (newest first)
        seasons.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        this.seasons.set(seasons);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading seasons:', error);
        this.snackBar.open('Failed to load seasons', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  isCurrentSeason(season: Season): boolean {
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);
    return now >= start && now <= end;
  }

  getSeasonStatus(season: Season): string {
    const now = new Date();
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  }

  getSeasonStatusLabel(season: Season): string {
    const status = this.getSeasonStatus(season);
    switch (status) {
      case 'active': return 'In Progress';
      case 'upcoming': return 'Upcoming';
      case 'completed': return 'Completed';
      default: return status;
    }
  }

  getSeasonDuration(season: Season): string {
    const start = new Date(season.startDate);
    const end = new Date(season.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const weeks = Math.floor((diffDays % 30) / 7);

    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}${weeks > 0 ? `, ${weeks} week${weeks > 1 ? 's' : ''}` : ''}`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  }

  openDialog(season?: Season): void {
    this.editingSeason.set(season || null);
    if (season) {
      this.seasonForm.patchValue({
        name: season.name,
        startDate: season.startDate.split('T')[0],
        endDate: season.endDate.split('T')[0],
        description: season.description || ''
      });
    } else {
      this.seasonForm.reset();
    }
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingSeason.set(null);
    this.seasonForm.reset();
  }

  saveSeason(): void {
    if (this.seasonForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.seasonForm.value;

    const seasonData: CreateSeasonRequest = {
      name: formValue.name,
      startDate: formValue.startDate,
      endDate: formValue.endDate,
      description: formValue.description || undefined
    };

    const editing = this.editingSeason();

    if (editing) {
      this.seasonsService.updateSeason(editing.id, seasonData).subscribe({
        next: () => {
          this.snackBar.open('Season updated successfully', 'Close', { duration: 3000 });
          this.closeDialog();
          this.loadSeasons();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error updating season:', error);
          this.snackBar.open('Failed to update season', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    } else {
      this.seasonsService.createSeason(seasonData).subscribe({
        next: () => {
          this.snackBar.open('Season created successfully', 'Close', { duration: 3000 });
          this.closeDialog();
          this.loadSeasons();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error creating season:', error);
          this.snackBar.open('Failed to create season', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    }
  }

  deleteSeason(season: Season): void {
    this.confirmDialog.confirmDelete(season.name, 'Season').subscribe(confirmed => {
      if (confirmed) {
        this.seasonsService.deleteSeason(season.id).subscribe({
          next: () => {
            this.snackBar.open('Season deleted successfully', 'Close', { duration: 3000 });
            this.loadSeasons();
          },
          error: (error) => {
            console.error('Error deleting season:', error);
            this.snackBar.open('Failed to delete season', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
