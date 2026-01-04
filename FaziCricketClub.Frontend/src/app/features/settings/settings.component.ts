import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-settings',
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
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTabsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-description">Manage your account and preferences</p>
        </div>
      </div>

      <mat-tab-group class="settings-tabs" animationDuration="200ms">
        <!-- Profile Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </ng-template>
          <div class="tab-content">
            <div class="card settings-card">
              <div class="card-header">
                <div class="profile-avatar">
                  <span>{{ userInitials() }}</span>
                </div>
                <div>
                  <h2 class="card-title">Edit Profile</h2>
                  <p class="card-subtitle">Update your personal information</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="card-body">
                <div class="form-row">
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>First Name</mat-label>
                    <input matInput formControlName="firstName" placeholder="Enter first name">
                  </mat-form-field>
                  <mat-form-field appearance="outline" class="half-width">
                    <mat-label>Last Name</mat-label>
                    <input matInput formControlName="lastName" placeholder="Enter last name">
                  </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Username</mat-label>
                  <input matInput formControlName="userName" placeholder="Enter username">
                  <mat-hint>This is your display name</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" readonly>
                  <mat-hint>Email cannot be changed</mat-hint>
                </mat-form-field>

                <div class="form-actions">
                  <button mat-flat-button color="primary" type="submit" [disabled]="profileForm.invalid || isSavingProfile()">
                    @if (isSavingProfile()) {
                      <mat-icon class="spin">sync</mat-icon>
                      Saving...
                    } @else {
                      <mat-icon>save</mat-icon>
                      Save Changes
                    }
                  </button>
                </div>
              </form>
            </div>
          </div>
        </mat-tab>

        <!-- Security Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>security</mat-icon>
            <span>Security</span>
          </ng-template>
          <div class="tab-content">
            <div class="card settings-card">
              <div class="card-header">
                <mat-icon class="card-icon security">lock</mat-icon>
                <div>
                  <h2 class="card-title">Change Password</h2>
                  <p class="card-subtitle">Update your password regularly for security</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="card-body">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Current Password</mat-label>
                  <input matInput formControlName="currentPassword" type="password">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>New Password</mat-label>
                  <input matInput formControlName="newPassword" type="password">
                  <mat-hint>Minimum 8 characters</mat-hint>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirm New Password</mat-label>
                  <input matInput formControlName="confirmPassword" type="password">
                  @if (passwordForm.hasError('passwordMismatch')) {
                    <mat-error>Passwords do not match</mat-error>
                  }
                </mat-form-field>

                <div class="info-banner">
                  <mat-icon>info</mat-icon>
                  <span>Password change requires backend API support. This feature is currently a preview.</span>
                </div>

                <div class="form-actions">
                  <button mat-flat-button color="primary" type="submit" [disabled]="passwordForm.invalid || isSavingPassword()">
                    @if (isSavingPassword()) {
                      <mat-icon class="spin">sync</mat-icon>
                      Updating...
                    } @else {
                      <mat-icon>lock</mat-icon>
                      Update Password
                    }
                  </button>
                </div>
              </form>
            </div>

            <div class="card settings-card">
              <div class="card-header">
                <mat-icon class="card-icon warning">warning</mat-icon>
                <div>
                  <h2 class="card-title">Sessions</h2>
                  <p class="card-subtitle">Manage your active sessions</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="card-body">
                <div class="session-item current">
                  <div class="session-info">
                    <mat-icon>computer</mat-icon>
                    <div>
                      <span class="session-name">Current Session</span>
                      <span class="session-detail">This device - Active now</span>
                    </div>
                  </div>
                  <span class="session-badge">Current</span>
                </div>

                <button mat-stroked-button color="warn" class="logout-all-btn" disabled>
                  <mat-icon>logout</mat-icon>
                  Sign Out All Other Sessions
                </button>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Preferences Tab -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon>tune</mat-icon>
            <span>Preferences</span>
          </ng-template>
          <div class="tab-content">
            <div class="card settings-card">
              <div class="card-header">
                <mat-icon class="card-icon">notifications</mat-icon>
                <div>
                  <h2 class="card-title">Notifications</h2>
                  <p class="card-subtitle">Control how you receive notifications</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="card-body">
                <div class="toggle-setting">
                  <div class="toggle-info">
                    <span class="toggle-label">Email Notifications</span>
                    <span class="toggle-description">Receive updates via email</span>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.emailNotifications"></mat-slide-toggle>
                </div>

                <div class="toggle-setting">
                  <div class="toggle-info">
                    <span class="toggle-label">Match Reminders</span>
                    <span class="toggle-description">Get notified before your matches</span>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.matchReminders"></mat-slide-toggle>
                </div>

                <div class="toggle-setting">
                  <div class="toggle-info">
                    <span class="toggle-label">Team Updates</span>
                    <span class="toggle-description">Notifications about team changes</span>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.teamUpdates"></mat-slide-toggle>
                </div>

                <div class="toggle-setting">
                  <div class="toggle-info">
                    <span class="toggle-label">Leaderboard Changes</span>
                    <span class="toggle-description">Alert when your ranking changes</span>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.leaderboardAlerts"></mat-slide-toggle>
                </div>
              </div>
            </div>

            <div class="card settings-card">
              <div class="card-header">
                <mat-icon class="card-icon">palette</mat-icon>
                <div>
                  <h2 class="card-title">Appearance</h2>
                  <p class="card-subtitle">Customize the look and feel</p>
                </div>
              </div>
              <mat-divider></mat-divider>
              <div class="card-body">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Theme</mat-label>
                  <mat-select [(ngModel)]="preferences.theme">
                    <mat-option value="light">Light</mat-option>
                    <mat-option value="dark" disabled>Dark (Coming Soon)</mat-option>
                    <mat-option value="system" disabled>System Default (Coming Soon)</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Language</mat-label>
                  <mat-select [(ngModel)]="preferences.language">
                    <mat-option value="en">English</mat-option>
                    <mat-option value="es" disabled>Spanish (Coming Soon)</mat-option>
                    <mat-option value="hi" disabled>Hindi (Coming Soon)</mat-option>
                  </mat-select>
                </mat-form-field>

                <div class="toggle-setting">
                  <div class="toggle-info">
                    <span class="toggle-label">Compact Mode</span>
                    <span class="toggle-description">Use smaller spacing in lists</span>
                  </div>
                  <mat-slide-toggle [(ngModel)]="preferences.compactMode"></mat-slide-toggle>
                </div>
              </div>
            </div>

            <div class="form-actions standalone">
              <button mat-flat-button color="primary" (click)="savePreferences()">
                <mat-icon>save</mat-icon>
                Save Preferences
              </button>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
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

    .settings-tabs ::ng-deep .mat-mdc-tab {
      min-width: 120px;
    }

    .settings-tabs ::ng-deep .mat-mdc-tab .mdc-tab__content {
      gap: 8px;
    }

    .tab-content {
      padding: 24px 0;
      display: flex;
      flex-direction: column;
      gap: 24px;
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

    .profile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2eb82e, #1c961c);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
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

    .card-icon.security {
      background: linear-gradient(135deg, #1976d2, #1565c0);
    }

    .card-icon.warning {
      background: linear-gradient(135deg, #ff9800, #f57c00);
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

    .form-row {
      display: flex;
      gap: 16px;
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    .half-width {
      flex: 1;
      margin-bottom: 8px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }

    .form-actions.standalone {
      padding: 0;
    }

    .form-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .info-banner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: rgba(25, 118, 210, 0.1);
      border-radius: 8px;
      font-size: 13px;
      color: #1976d2;
      margin-bottom: 16px;
    }

    .info-banner mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
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

    .session-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: var(--app-background);
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .session-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .session-info mat-icon {
      color: var(--app-text-secondary);
    }

    .session-info > div {
      display: flex;
      flex-direction: column;
    }

    .session-name {
      font-weight: 500;
      font-size: 14px;
    }

    .session-detail {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .session-badge {
      padding: 4px 12px;
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .logout-all-btn {
      width: 100%;
      justify-content: center;
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
      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .half-width {
        width: 100%;
      }

      .settings-tabs ::ng-deep .mat-mdc-tab {
        min-width: 80px;
      }
    }
  `]
})
export class SettingsComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  isSavingProfile = signal(false);
  isSavingPassword = signal(false);

  currentUser = this.authService.currentUser;

  userInitials = computed(() => {
    const user = this.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.userName) {
      return user.userName.substring(0, 2).toUpperCase();
    }
    return 'U';
  });

  profileForm: FormGroup = this.fb.group({
    firstName: [this.currentUser()?.firstName || ''],
    lastName: [this.currentUser()?.lastName || ''],
    userName: [this.currentUser()?.userName || ''],
    email: [{ value: this.currentUser()?.email || '', disabled: true }]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  preferences = {
    emailNotifications: true,
    matchReminders: true,
    teamUpdates: true,
    leaderboardAlerts: false,
    theme: 'light',
    language: 'en',
    compactMode: false
  };

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSavingProfile.set(true);

    // Simulate API call - in real implementation, call backend
    setTimeout(() => {
      this.isSavingProfile.set(false);
      this.snackBar.open('Profile updated successfully', 'Close', { duration: 3000 });
    }, 1000);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.isSavingPassword.set(true);

    // Simulate API call - would need backend support
    setTimeout(() => {
      this.isSavingPassword.set(false);
      this.snackBar.open('Password change requires backend API support', 'Close', { duration: 3000 });
      this.passwordForm.reset();
    }, 1000);
  }

  savePreferences(): void {
    // Save to localStorage for now
    localStorage.setItem('userPreferences', JSON.stringify(this.preferences));
    this.snackBar.open('Preferences saved', 'Close', { duration: 3000 });
  }
}
