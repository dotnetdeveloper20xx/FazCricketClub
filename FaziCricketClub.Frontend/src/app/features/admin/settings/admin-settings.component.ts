import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Admin Settings</h1>
          <p class="page-description">Configure system-wide settings for the club</p>
        </div>
      </div>

      <div class="settings-grid">
        <!-- Club Information -->
        <div class="card settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">sports_cricket</mat-icon>
            <div>
              <h2 class="card-title">Club Information</h2>
              <p class="card-subtitle">Basic details about your cricket club</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="card-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Club Name</mat-label>
              <input matInput [(ngModel)]="settings.clubName" placeholder="Enter club name">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Club Email</mat-label>
              <input matInput type="email" [(ngModel)]="settings.clubEmail" placeholder="contact@club.com">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contact Phone</mat-label>
              <input matInput [(ngModel)]="settings.clubPhone" placeholder="+1 234 567 890">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Club Address</mat-label>
              <textarea matInput [(ngModel)]="settings.clubAddress" rows="2" placeholder="Enter club address"></textarea>
            </mat-form-field>
          </div>
        </div>

        <!-- Match Settings -->
        <div class="card settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">sports_score</mat-icon>
            <div>
              <h2 class="card-title">Match Settings</h2>
              <p class="card-subtitle">Default configurations for matches</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="card-body">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Default Match Format</mat-label>
              <mat-select [(ngModel)]="settings.defaultMatchFormat">
                <mat-option value="T20">T20 (20 Overs)</mat-option>
                <mat-option value="ODI">ODI (50 Overs)</mat-option>
                <mat-option value="T10">T10 (10 Overs)</mat-option>
                <mat-option value="Custom">Custom</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Default Overs Per Match</mat-label>
              <input matInput type="number" [(ngModel)]="settings.defaultOvers" min="1" max="50">
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Players Per Team</mat-label>
              <input matInput type="number" [(ngModel)]="settings.playersPerTeam" min="5" max="15">
            </mat-form-field>

            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Allow Super Over</span>
                <span class="toggle-description">Enable super over in case of a tie</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.allowSuperOver"></mat-slide-toggle>
            </div>
          </div>
        </div>

        <!-- Registration Settings -->
        <div class="card settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">person_add</mat-icon>
            <div>
              <h2 class="card-title">Registration Settings</h2>
              <p class="card-subtitle">Control user registration behavior</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="card-body">
            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Allow Public Registration</span>
                <span class="toggle-description">Anyone can create an account</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.allowPublicRegistration"></mat-slide-toggle>
            </div>

            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Require Email Verification</span>
                <span class="toggle-description">Users must verify email before access</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.requireEmailVerification"></mat-slide-toggle>
            </div>

            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Auto-Assign Player Role</span>
                <span class="toggle-description">New users automatically get Player role</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.autoAssignPlayerRole"></mat-slide-toggle>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Default Role for New Users</mat-label>
              <mat-select [(ngModel)]="settings.defaultRole">
                <mat-option value="Player">Player</mat-option>
                <mat-option value="Member">Member</mat-option>
                <mat-option value="Guest">Guest</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Notification Settings -->
        <div class="card settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">notifications</mat-icon>
            <div>
              <h2 class="card-title">Notification Settings</h2>
              <p class="card-subtitle">Configure system notifications</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="card-body">
            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Email Notifications</span>
                <span class="toggle-description">Send email alerts for important events</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.emailNotifications"></mat-slide-toggle>
            </div>

            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Match Reminders</span>
                <span class="toggle-description">Send reminders before scheduled matches</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.matchReminders"></mat-slide-toggle>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reminder Hours Before Match</mat-label>
              <mat-select [(ngModel)]="settings.reminderHours">
                <mat-option [value]="1">1 hour</mat-option>
                <mat-option [value]="2">2 hours</mat-option>
                <mat-option [value]="6">6 hours</mat-option>
                <mat-option [value]="12">12 hours</mat-option>
                <mat-option [value]="24">24 hours</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Season Settings -->
        <div class="card settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">date_range</mat-icon>
            <div>
              <h2 class="card-title">Season Settings</h2>
              <p class="card-subtitle">Configure season behavior</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="card-body">
            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Auto-Archive Past Seasons</span>
                <span class="toggle-description">Automatically archive seasons after end date</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.autoArchiveSeasons"></mat-slide-toggle>
            </div>

            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Allow Multiple Active Seasons</span>
                <span class="toggle-description">Enable running multiple seasons simultaneously</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.allowMultipleSeasons"></mat-slide-toggle>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Default Season Duration (months)</mat-label>
              <input matInput type="number" [(ngModel)]="settings.defaultSeasonDuration" min="1" max="12">
            </mat-form-field>
          </div>
        </div>

        <!-- Data & Privacy -->
        <div class="card settings-card">
          <div class="card-header">
            <mat-icon class="card-icon">security</mat-icon>
            <div>
              <h2 class="card-title">Data & Privacy</h2>
              <p class="card-subtitle">Privacy and data retention settings</p>
            </div>
          </div>
          <mat-divider></mat-divider>
          <div class="card-body">
            <div class="toggle-setting">
              <div class="toggle-info">
                <span class="toggle-label">Show Player Statistics Publicly</span>
                <span class="toggle-description">Allow non-logged users to view stats</span>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.publicStats"></mat-slide-toggle>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Data Retention Period</mat-label>
              <mat-select [(ngModel)]="settings.dataRetention">
                <mat-option value="1year">1 Year</mat-option>
                <mat-option value="2years">2 Years</mat-option>
                <mat-option value="5years">5 Years</mat-option>
                <mat-option value="forever">Forever</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="actions-bar">
        <button mat-stroked-button (click)="resetSettings()">
          <mat-icon>refresh</mat-icon>
          Reset to Defaults
        </button>
        <button mat-flat-button color="primary" (click)="saveSettings()" [disabled]="isSaving()">
          @if (isSaving()) {
            <mat-icon class="spin">sync</mat-icon>
            Saving...
          } @else {
            <mat-icon>save</mat-icon>
            Save Settings
          }
        </button>
      </div>
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

    .settings-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 24px;
      margin-bottom: 24px;
    }

    .settings-card {
      padding: 0;
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px 24px;
    }

    .card-icon {
      width: 48px;
      height: 48px;
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #2eb82e, #1c961c);
      color: white;
      border-radius: 12px;
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .card-subtitle {
      font-size: 13px;
      color: var(--app-text-secondary);
      margin: 4px 0 0;
    }

    .card-body {
      padding: 24px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .toggle-setting {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--app-background);
      border-radius: 8px;
      margin-bottom: 12px;
    }

    .toggle-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toggle-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--app-text);
    }

    .toggle-description {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .actions-bar {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      background: var(--app-surface);
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }

    .actions-bar button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .settings-grid {
        grid-template-columns: 1fr;
      }

      .actions-bar {
        flex-direction: column;
      }

      .actions-bar button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class AdminSettingsComponent {
  isSaving = signal(false);

  settings = {
    // Club Information
    clubName: 'FaziCricketClub',
    clubEmail: 'contact@fazicricketclub.com',
    clubPhone: '',
    clubAddress: '',

    // Match Settings
    defaultMatchFormat: 'T20',
    defaultOvers: 20,
    playersPerTeam: 11,
    allowSuperOver: true,

    // Registration Settings
    allowPublicRegistration: true,
    requireEmailVerification: false,
    autoAssignPlayerRole: true,
    defaultRole: 'Player',

    // Notification Settings
    emailNotifications: true,
    matchReminders: true,
    reminderHours: 24,

    // Season Settings
    autoArchiveSeasons: true,
    allowMultipleSeasons: false,
    defaultSeasonDuration: 6,

    // Data & Privacy
    publicStats: false,
    dataRetention: '5years'
  };

  constructor(private snackBar: MatSnackBar) {}

  saveSettings(): void {
    this.isSaving.set(true);

    // Simulate API call
    setTimeout(() => {
      this.isSaving.set(false);
      this.snackBar.open('Settings saved successfully', 'Close', { duration: 3000 });
    }, 1000);
  }

  resetSettings(): void {
    this.settings = {
      clubName: 'FaziCricketClub',
      clubEmail: 'contact@fazicricketclub.com',
      clubPhone: '',
      clubAddress: '',
      defaultMatchFormat: 'T20',
      defaultOvers: 20,
      playersPerTeam: 11,
      allowSuperOver: true,
      allowPublicRegistration: true,
      requireEmailVerification: false,
      autoAssignPlayerRole: true,
      defaultRole: 'Player',
      emailNotifications: true,
      matchReminders: true,
      reminderHours: 24,
      autoArchiveSeasons: true,
      allowMultipleSeasons: false,
      defaultSeasonDuration: 6,
      publicStats: false,
      dataRetention: '5years'
    };
    this.snackBar.open('Settings reset to defaults', 'Close', { duration: 3000 });
  }
}
