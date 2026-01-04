import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { EditProfileDialogComponent } from './edit-profile-dialog.component';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';
import { ProfileSkeletonComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    EditProfileDialogComponent,
    ChangePasswordDialogComponent,
    ProfileSkeletonComponent
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">My Profile</h1>
          <p class="page-description">View your account information</p>
        </div>
      </div>

      @if (!currentUser()) {
        <app-profile-skeleton></app-profile-skeleton>
      } @else {
        <div class="profile-content">
          <!-- Profile Card -->
          <div class="card profile-card">
            <div class="profile-header">
              <div class="profile-avatar">
                <span>{{ userInitials() }}</span>
              </div>
              <div class="profile-info">
                <h2 class="profile-name">{{ displayName() }}</h2>
                <span class="profile-email">{{ currentUser()!.email }}</span>
              </div>
            </div>

            <div class="profile-details">
              <div class="detail-section">
                <h3 class="section-title">
                  <mat-icon>person</mat-icon>
                  Account Information
                </h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">Username</span>
                    <span class="detail-value">{{ currentUser()!.userName }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">{{ currentUser()!.email }}</span>
                  </div>
                  @if (currentUser()!.firstName) {
                    <div class="detail-item">
                      <span class="detail-label">First Name</span>
                      <span class="detail-value">{{ currentUser()!.firstName }}</span>
                    </div>
                  }
                  @if (currentUser()!.lastName) {
                    <div class="detail-item">
                      <span class="detail-label">Last Name</span>
                      <span class="detail-value">{{ currentUser()!.lastName }}</span>
                    </div>
                  }
                </div>
              </div>

              <div class="detail-section">
                <h3 class="section-title">
                  <mat-icon>security</mat-icon>
                  Roles & Permissions
                </h3>
                <div class="roles-container">
                  <div class="roles-row">
                    <span class="roles-label">Roles:</span>
                    <div class="roles-chips">
                      @for (role of currentUser()!.roles; track role) {
                        <span class="role-chip" [class]="getRoleClass(role)">
                          <mat-icon>{{ getRoleIcon(role) }}</mat-icon>
                          {{ role }}
                        </span>
                      }
                      @if (currentUser()!.roles.length === 0) {
                        <span class="no-roles">No roles assigned</span>
                      }
                    </div>
                  </div>
                </div>

                @if (currentUser()!.permissions && currentUser()!.permissions!.length > 0) {
                  <div class="permissions-container">
                    <span class="permissions-label">Permissions:</span>
                    <div class="permissions-list">
                      @for (permission of currentUser()!.permissions; track permission) {
                        <span class="permission-chip">
                          <mat-icon>check_circle</mat-icon>
                          {{ permission }}
                        </span>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="card quick-actions">
            <h3 class="section-title">
              <mat-icon>flash_on</mat-icon>
              Quick Actions
            </h3>
            <div class="actions-list">
              <button mat-stroked-button class="action-btn" (click)="openChangePassword()">
                <mat-icon>lock</mat-icon>
                Change Password
              </button>
              <button mat-stroked-button class="action-btn" (click)="openEditProfile()">
                <mat-icon>edit</mat-icon>
                Edit Profile
              </button>
              <button mat-stroked-button class="action-btn" routerLink="/settings">
                <mat-icon>notifications</mat-icon>
                Notification Settings
              </button>
            </div>
          </div>

          <!-- Session Info -->
          <div class="card session-info">
            <h3 class="section-title">
              <mat-icon>info</mat-icon>
              Session Information
            </h3>
            <div class="session-details">
              <div class="session-item">
                <mat-icon>login</mat-icon>
                <div class="session-content">
                  <span class="session-label">Status</span>
                  <span class="session-value active">
                    <span class="status-dot"></span>
                    Logged In
                  </span>
                </div>
              </div>
              <div class="session-item">
                <mat-icon>badge</mat-icon>
                <div class="session-content">
                  <span class="session-label">User ID</span>
                  <span class="session-value">{{ currentUser()!.id }}</span>
                </div>
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

    .profile-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .profile-card {
      grid-row: span 2;
      padding: 0;
      overflow: hidden;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 32px;
      background: linear-gradient(135deg, var(--app-primary), #1c961c);
      color: white;
    }

    .profile-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 4px;
    }

    .profile-email {
      opacity: 0.9;
      font-size: 15px;
    }

    .profile-details {
      padding: 24px;
    }

    .detail-section {
      margin-bottom: 24px;
    }

    .detail-section:last-child {
      margin-bottom: 0;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 16px;
      color: var(--app-text);
    }

    .section-title mat-icon {
      color: var(--app-primary);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item {
      padding: 16px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .detail-label {
      display: block;
      font-size: 12px;
      color: var(--app-text-secondary);
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-value {
      font-size: 15px;
      font-weight: 500;
    }

    .roles-container {
      margin-bottom: 16px;
    }

    .roles-row {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
    }

    .roles-label {
      font-size: 14px;
      color: var(--app-text-secondary);
    }

    .roles-chips {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .role-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
    }

    .role-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .role-chip.admin {
      background: rgba(156, 39, 176, 0.15);
      color: #7b1fa2;
    }

    .role-chip.captain {
      background: rgba(255, 152, 0, 0.15);
      color: #f57c00;
    }

    .role-chip.player {
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .no-roles {
      color: var(--app-text-secondary);
      font-style: italic;
      font-size: 14px;
    }

    .permissions-container {
      margin-top: 16px;
    }

    .permissions-label {
      display: block;
      font-size: 14px;
      color: var(--app-text-secondary);
      margin-bottom: 8px;
    }

    .permissions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .permission-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      background: var(--app-background);
      border-radius: 4px;
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .permission-chip mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: var(--app-primary);
    }

    .quick-actions {
      padding: 20px;
    }

    .actions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-btn {
      justify-content: flex-start;
      gap: 8px;
      padding: 12px 16px;
      height: auto;
      transition: background-color 0.2s ease;
    }

    .action-btn:hover {
      background: var(--app-background);
    }

    .session-info {
      padding: 20px;
    }

    .session-details {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .session-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--app-background);
      border-radius: 8px;
    }

    .session-item mat-icon {
      color: var(--app-text-secondary);
    }

    .session-content {
      display: flex;
      flex-direction: column;
    }

    .session-label {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .session-value {
      font-size: 14px;
      font-weight: 500;
    }

    .session-value.active {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #388e3c;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #388e3c;
    }

    @media (max-width: 1024px) {
      .profile-content {
        grid-template-columns: 1fr;
      }

      .profile-card {
        grid-row: auto;
      }
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private dialog = inject(MatDialog);
  private notificationService = inject(NotificationService);

  currentUser = this.authService.currentUser;

  displayName = computed(() => {
    const user = this.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.userName || 'User';
  });

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

  ngOnInit(): void {
    // User is already loaded via AuthService
  }

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  getRoleIcon(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin': return 'admin_panel_settings';
      case 'captain': return 'military_tech';
      case 'player': return 'sports_cricket';
      default: return 'person';
    }
  }

  openEditProfile(): void {
    const user = this.currentUser();
    if (!user) return;

    const dialogRef = this.dialog.open(EditProfileDialogComponent, {
      width: '500px',
      data: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // In a real app, this would call an API to update the profile
        this.notificationService.success('Profile updated successfully');
      }
    });
  }

  openChangePassword(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialogComponent, {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // In a real app, this would call an API to change the password
        this.notificationService.success('Password changed successfully');
      }
    });
  }
}
