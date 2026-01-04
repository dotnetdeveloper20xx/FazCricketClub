import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { TeamsService } from '../../core/services/teams.service';
import { Team } from '../../shared/models';

@Component({
  selector: 'app-teams-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Teams</h1>
          <p class="page-description">Manage cricket teams and rosters</p>
        </div>
        <button class="btn btn-primary" (click)="openTeamDialog()">
          <mat-icon>group_add</mat-icon>
          Create Team
        </button>
      </div>

      <!-- Teams Grid -->
      @if (isLoading()) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading teams...</p>
        </div>
      } @else if (teams().length === 0) {
        <div class="card empty-state">
          <mat-icon class="empty-icon">group_work</mat-icon>
          <h3>No teams found</h3>
          <p>Get started by creating your first team</p>
          <button class="btn btn-primary" (click)="openTeamDialog()">
            <mat-icon>group_add</mat-icon>
            Create Team
          </button>
        </div>
      } @else {
        <div class="teams-grid">
          @for (team of teams(); track team.id) {
            <div class="team-card card">
              <div class="team-header">
                <div class="team-icon" [class.inactive]="!team.isActive">
                  <mat-icon>groups</mat-icon>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="menu" class="team-menu">
                  <mat-icon>more_vert</mat-icon>
                </button>
                <mat-menu #menu="matMenu">
                  <button mat-menu-item (click)="openTeamDialog(team)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit</span>
                  </button>
                  <button mat-menu-item (click)="toggleTeamStatus(team)">
                    <mat-icon>{{ team.isActive ? 'block' : 'check_circle' }}</mat-icon>
                    <span>{{ team.isActive ? 'Deactivate' : 'Activate' }}</span>
                  </button>
                  <button mat-menu-item class="delete-action" (click)="deleteTeam(team)">
                    <mat-icon>delete</mat-icon>
                    <span>Delete</span>
                  </button>
                </mat-menu>
              </div>
              <div class="team-body">
                <a [routerLink]="['/teams', team.id]" class="team-name">{{ team.name }}</a>
                <p class="team-description">{{ team.description || 'No description' }}</p>
                <div class="team-status">
                  <span class="status-chip" [class.active]="team.isActive" [class.inactive]="!team.isActive">
                    {{ team.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Team Dialog (Create/Edit) -->
      @if (showDialog()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingTeam() ? 'Edit Team' : 'Create New Team' }}</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form [formGroup]="teamForm" (ngSubmit)="saveTeam()">
              <div class="dialog-body">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Team Name</mat-label>
                  <input matInput formControlName="name" placeholder="Enter team name">
                  @if (teamForm.get('name')?.hasError('required') && teamForm.get('name')?.touched) {
                    <mat-error>Team name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Description</mat-label>
                  <textarea matInput formControlName="description" rows="4" placeholder="Team description (optional)"></textarea>
                </mat-form-field>
              </div>
              <div class="dialog-footer">
                <button mat-stroked-button type="button" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="teamForm.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    {{ editingTeam() ? 'Update' : 'Create' }}
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

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

    .teams-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .team-card {
      padding: 0;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .team-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .team-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 20px 0;
    }

    .team-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--app-primary), var(--app-primary-dark, #1565c0));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .team-icon.inactive {
      background: linear-gradient(135deg, #9e9e9e, #757575);
    }

    .team-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .team-body {
      padding: 16px 20px 20px;
    }

    .team-name {
      display: block;
      font-size: 18px;
      font-weight: 600;
      margin: 0 0 8px;
      color: var(--app-text);
      text-decoration: none;
      transition: color 0.2s;
    }

    .team-name:hover {
      color: var(--app-primary);
    }

    .team-description {
      font-size: 14px;
      color: var(--app-text-secondary);
      margin: 0 0 12px;
      min-height: 40px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .team-status {
      display: flex;
      align-items: center;
    }

    .status-chip {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-chip.active {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .status-chip.inactive {
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .teams-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamsListComponent implements OnInit {
  private teamsService = inject(TeamsService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // State
  teams = signal<Team[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  showDialog = signal(false);
  editingTeam = signal<Team | null>(null);

  teamForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: ['']
  });

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.isLoading.set(true);

    this.teamsService.getTeams().subscribe({
      next: (teams: Team[]) => {
        this.teams.set(teams);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading teams:', error);
        this.snackBar.open('Failed to load teams', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  openTeamDialog(team?: Team): void {
    this.editingTeam.set(team || null);
    if (team) {
      this.teamForm.patchValue({
        name: team.name,
        description: team.description || ''
      });
    } else {
      this.teamForm.reset();
    }
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingTeam.set(null);
    this.teamForm.reset();
  }

  saveTeam(): void {
    if (this.teamForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.teamForm.value;

    const teamData = {
      name: formValue.name,
      description: formValue.description || undefined
    };

    const editing = this.editingTeam();

    if (editing) {
      // Update existing team
      this.teamsService.updateTeam(editing.id, { ...teamData, isActive: editing.isActive }).subscribe({
        next: () => {
          this.snackBar.open('Team updated successfully', 'Close', { duration: 3000 });
          this.closeDialog();
          this.loadTeams();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error updating team:', error);
          this.snackBar.open('Failed to update team', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    } else {
      // Create new team
      this.teamsService.createTeam(teamData).subscribe({
        next: () => {
          this.snackBar.open('Team created successfully', 'Close', { duration: 3000 });
          this.closeDialog();
          this.loadTeams();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error creating team:', error);
          this.snackBar.open('Failed to create team', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    }
  }

  toggleTeamStatus(team: Team): void {
    const newStatus = !team.isActive;
    this.teamsService.updateTeam(team.id, {
      name: team.name,
      description: team.description,
      isActive: newStatus
    }).subscribe({
      next: () => {
        this.snackBar.open(`Team ${newStatus ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
        this.loadTeams();
      },
      error: (error) => {
        console.error('Error updating team status:', error);
        this.snackBar.open('Failed to update team status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteTeam(team: Team): void {
    if (confirm(`Are you sure you want to delete "${team.name}"?`)) {
      this.teamsService.deleteTeam(team.id).subscribe({
        next: () => {
          this.snackBar.open('Team deleted successfully', 'Close', { duration: 3000 });
          this.loadTeams();
        },
        error: (error) => {
          console.error('Error deleting team:', error);
          this.snackBar.open('Failed to delete team', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
