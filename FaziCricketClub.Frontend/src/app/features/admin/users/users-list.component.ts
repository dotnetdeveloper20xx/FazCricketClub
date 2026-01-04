import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminService } from '../../../core/services/admin.service';
import { AdminUser, AdminRole } from '../../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">User Management</h1>
          <p class="page-description">Manage system users and their roles</p>
        </div>
      </div>

      <!-- Search -->
      <div class="card filters-card">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search users</mat-label>
          <input matInput
                 [(ngModel)]="searchTerm"
                 placeholder="Search by name or email...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
      </div>

      <!-- Users Table -->
      <div class="card table-card">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading users...</p>
          </div>
        } @else if (filteredUsers().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">manage_accounts</mat-icon>
            <h3>No users found</h3>
            <p>{{ searchTerm ? 'Try adjusting your search' : 'No users in the system' }}</p>
          </div>
        } @else {
          <div class="table-container">
            <table mat-table [dataSource]="filteredUsers()" class="users-table">
              <!-- User Column -->
              <ng-container matColumnDef="user">
                <th mat-header-cell *matHeaderCellDef>User</th>
                <td mat-cell *matCellDef="let user">
                  <div class="user-info">
                    <div class="avatar">{{ getInitials(user.userName) }}</div>
                    <div class="user-details">
                      <span class="user-name">{{ user.userName }}</span>
                      <span class="user-email">{{ user.email }}</span>
                    </div>
                  </div>
                </td>
              </ng-container>

              <!-- Roles Column -->
              <ng-container matColumnDef="roles">
                <th mat-header-cell *matHeaderCellDef>Roles</th>
                <td mat-cell *matCellDef="let user">
                  <div class="roles-list">
                    @for (role of user.roles; track role) {
                      <span class="role-chip" [class]="getRoleClass(role)">
                        {{ role }}
                        <button mat-icon-button
                                class="remove-role-btn"
                                matTooltip="Remove role"
                                (click)="removeRole(user, role); $event.stopPropagation()">
                          <mat-icon>close</mat-icon>
                        </button>
                      </span>
                    }
                    @if (user.roles.length === 0) {
                      <span class="no-roles">No roles assigned</span>
                    }
                  </div>
                </td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let user">
                  <span class="status-chip" [class.locked]="user.isLockedOut" [class.active]="!user.isLockedOut">
                    <mat-icon>{{ user.isLockedOut ? 'lock' : 'check_circle' }}</mat-icon>
                    {{ user.isLockedOut ? 'Locked' : 'Active' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let user">
                  <button mat-icon-button [matMenuTriggerFor]="menu">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item [matMenuTriggerFor]="rolesMenu">
                      <mat-icon>person_add</mat-icon>
                      <span>Assign Role</span>
                    </button>
                    @if (user.isLockedOut) {
                      <button mat-menu-item (click)="unlockUser(user)">
                        <mat-icon>lock_open</mat-icon>
                        <span>Unlock User</span>
                      </button>
                    } @else {
                      <button mat-menu-item [matMenuTriggerFor]="lockMenu">
                        <mat-icon>lock</mat-icon>
                        <span>Lock User</span>
                      </button>
                    }
                  </mat-menu>

                  <!-- Assign Role Sub-menu -->
                  <mat-menu #rolesMenu="matMenu">
                    @for (role of availableRolesForUser(user); track role.name) {
                      <button mat-menu-item (click)="assignRole(user, role.name)">
                        {{ role.name }}
                      </button>
                    }
                    @if (availableRolesForUser(user).length === 0) {
                      <button mat-menu-item disabled>All roles assigned</button>
                    }
                  </mat-menu>

                  <!-- Lock Duration Sub-menu -->
                  <mat-menu #lockMenu="matMenu">
                    <button mat-menu-item (click)="lockUser(user, 15)">15 minutes</button>
                    <button mat-menu-item (click)="lockUser(user, 60)">1 hour</button>
                    <button mat-menu-item (click)="lockUser(user, 1440)">24 hours</button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>
        }
      </div>
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

    .filters-card {
      margin-bottom: 16px;
      padding: 16px;
    }

    .search-field {
      width: 100%;
      max-width: 400px;
    }

    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .users-table {
      width: 100%;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--app-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 500;
    }

    .user-email {
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .roles-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .role-chip {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      background: rgba(33, 150, 243, 0.15);
      color: #1976d2;
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

    .remove-role-btn {
      width: 18px !important;
      height: 18px !important;
      line-height: 18px !important;
      margin-left: 4px;
    }

    .remove-role-btn mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      line-height: 14px;
    }

    .no-roles {
      color: var(--app-text-secondary);
      font-style: italic;
      font-size: 13px;
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-chip mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .status-chip.active {
      background: rgba(76, 175, 80, 0.15);
      color: #388e3c;
    }

    .status-chip.locked {
      background: rgba(244, 67, 54, 0.15);
      color: #d32f2f;
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
      margin: 0;
      color: var(--app-text-secondary);
    }

    th.mat-header-cell {
      font-weight: 600;
      color: var(--app-text-secondary);
    }

    @media (max-width: 768px) {
      .user-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .avatar {
        width: 32px;
        height: 32px;
        font-size: 12px;
      }
    }
  `]
})
export class UsersListComponent implements OnInit {
  private adminService = inject(AdminService);
  private snackBar = inject(MatSnackBar);

  // State
  users = signal<AdminUser[]>([]);
  roles = signal<AdminRole[]>([]);
  isLoading = signal(false);
  searchTerm = '';

  displayedColumns = ['user', 'roles', 'status', 'actions'];

  filteredUsers = computed(() => {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.users();
    return this.users().filter(user =>
      user.userName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      users: this.adminService.getUsers(),
      roles: this.adminService.getRoles()
    }).subscribe({
      next: ({ users, roles }) => {
        this.users.set(users);
        this.roles.set(roles);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
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

  getRoleClass(role: string): string {
    return role.toLowerCase();
  }

  availableRolesForUser(user: AdminUser): AdminRole[] {
    return this.roles().filter(role => !user.roles.includes(role.name));
  }

  assignRole(user: AdminUser, roleName: string): void {
    this.adminService.assignRole(user.id, { roleName }).subscribe({
      next: () => {
        this.snackBar.open(`Role "${roleName}" assigned to ${user.userName}`, 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Error assigning role:', error);
        this.snackBar.open('Failed to assign role', 'Close', { duration: 3000 });
      }
    });
  }

  removeRole(user: AdminUser, roleName: string): void {
    if (user.roles.length === 1) {
      this.snackBar.open('Cannot remove the only role from a user', 'Close', { duration: 3000 });
      return;
    }

    if (confirm(`Remove "${roleName}" role from ${user.userName}?`)) {
      this.adminService.removeRole(user.id, roleName).subscribe({
        next: () => {
          this.snackBar.open(`Role "${roleName}" removed from ${user.userName}`, 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Error removing role:', error);
          this.snackBar.open('Failed to remove role', 'Close', { duration: 3000 });
        }
      });
    }
  }

  lockUser(user: AdminUser, minutes: number): void {
    if (confirm(`Lock ${user.userName} for ${minutes} minutes?`)) {
      this.adminService.lockUser(user.id, { minutes }).subscribe({
        next: () => {
          this.snackBar.open(`${user.userName} locked for ${minutes} minutes`, 'Close', { duration: 3000 });
          this.loadData();
        },
        error: (error) => {
          console.error('Error locking user:', error);
          this.snackBar.open('Failed to lock user', 'Close', { duration: 3000 });
        }
      });
    }
  }

  unlockUser(user: AdminUser): void {
    this.adminService.unlockUser(user.id).subscribe({
      next: () => {
        this.snackBar.open(`${user.userName} unlocked`, 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Error unlocking user:', error);
        this.snackBar.open('Failed to unlock user', 'Close', { duration: 3000 });
      }
    });
  }
}
