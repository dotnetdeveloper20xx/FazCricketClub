import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { AdminService } from '../../../core/services/admin.service';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { AdminRole, Permission } from '../../../shared/models';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-roles-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Role Management</h1>
          <p class="page-description">Manage roles and their permissions</p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="card loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading roles...</p>
        </div>
      } @else {
        <!-- Roles Grid -->
        <div class="roles-grid">
          @for (role of roles(); track role.id) {
            <div class="role-card card">
              <div class="role-header">
                <div class="role-icon" [class]="getRoleClass(role.name)">
                  <mat-icon>{{ getRoleIcon(role.name) }}</mat-icon>
                </div>
                <div class="role-info">
                  <h3 class="role-name">{{ role.name }}</h3>
                  <span class="permission-count">{{ role.permissions.length }} permissions</span>
                </div>
                <button mat-icon-button [matMenuTriggerFor]="addMenu" matTooltip="Add permission">
                  <mat-icon>add</mat-icon>
                </button>
                <mat-menu #addMenu="matMenu">
                  @for (perm of getAvailablePermissions(role); track perm.value) {
                    <button mat-menu-item (click)="addPermission(role, perm.value)">
                      <mat-icon>{{ getPermissionIcon(perm.value) }}</mat-icon>
                      <span>{{ perm.value }}</span>
                    </button>
                  }
                  @if (getAvailablePermissions(role).length === 0) {
                    <button mat-menu-item disabled>All permissions assigned</button>
                  }
                </mat-menu>
              </div>

              <div class="role-body">
                <div class="permissions-section">
                  <h4 class="section-title">Permissions</h4>
                  <div class="permissions-list">
                    @for (perm of role.permissions; track perm) {
                      <div class="permission-chip" [class]="getPermissionCategory(perm)">
                        <mat-icon>{{ getPermissionIcon(perm) }}</mat-icon>
                        <span>{{ perm }}</span>
                        <button mat-icon-button
                                class="remove-btn"
                                matTooltip="Remove permission"
                                (click)="removePermission(role, perm)">
                          <mat-icon>close</mat-icon>
                        </button>
                      </div>
                    }
                    @if (role.permissions.length === 0) {
                      <p class="no-permissions">No permissions assigned</p>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Permissions Reference -->
        <div class="card permissions-reference">
          <h3 class="reference-title">
            <mat-icon>info</mat-icon>
            Available Permissions Reference
          </h3>
          <div class="permissions-grid">
            @for (category of permissionCategories(); track category.name) {
              <div class="permission-category">
                <h4 class="category-name">{{ category.name }}</h4>
                <div class="category-permissions">
                  @for (perm of category.permissions; track perm.value) {
                    <div class="reference-permission">
                      <mat-icon>{{ getPermissionIcon(perm.value) }}</mat-icon>
                      <div class="perm-details">
                        <span class="perm-value">{{ perm.value }}</span>
                        <span class="perm-desc">{{ perm.description }}</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .role-card {
      padding: 0;
      overflow: hidden;
    }

    .role-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: var(--app-background);
      border-bottom: 1px solid var(--app-border);
    }

    .role-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .role-icon.admin {
      background: linear-gradient(135deg, #9c27b0, #7b1fa2);
    }

    .role-icon.captain {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .role-icon.player {
      background: linear-gradient(135deg, #4caf50, #388e3c);
    }

    .role-icon mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .role-info {
      flex: 1;
    }

    .role-name {
      font-size: 18px;
      font-weight: 600;
      margin: 0;
    }

    .permission-count {
      font-size: 13px;
      color: var(--app-text-secondary);
    }

    .role-body {
      padding: 20px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: var(--app-text-secondary);
      margin: 0 0 12px;
    }

    .permissions-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .permission-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 8px;
      background: var(--app-background);
      font-size: 13px;
    }

    .permission-chip mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--app-text-secondary);
    }

    .permission-chip span {
      flex: 1;
    }

    .permission-chip.players mat-icon { color: #4caf50; }
    .permission-chip.teams mat-icon { color: #2196f3; }
    .permission-chip.fixtures mat-icon { color: #ff9800; }
    .permission-chip.admin mat-icon { color: #9c27b0; }

    .remove-btn {
      width: 24px !important;
      height: 24px !important;
      line-height: 24px !important;
    }

    .remove-btn mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: var(--app-text-secondary);
    }

    .remove-btn:hover mat-icon {
      color: #f44336;
    }

    .no-permissions {
      color: var(--app-text-secondary);
      font-style: italic;
      margin: 0;
      padding: 8px 0;
    }

    .permissions-reference {
      padding: 24px;
    }

    .reference-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      margin: 0 0 20px;
      color: var(--app-text-secondary);
    }

    .reference-title mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 24px;
    }

    .permission-category {
      background: var(--app-background);
      border-radius: 8px;
      padding: 16px;
    }

    .category-name {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--app-border);
    }

    .category-permissions {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .reference-permission {
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .reference-permission mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-top: 2px;
      color: var(--app-text-secondary);
    }

    .perm-details {
      display: flex;
      flex-direction: column;
    }

    .perm-value {
      font-size: 13px;
      font-weight: 500;
    }

    .perm-desc {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    @media (max-width: 768px) {
      .roles-grid {
        grid-template-columns: 1fr;
      }

      .permissions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RolesListComponent implements OnInit {
  private adminService = inject(AdminService);
  private confirmDialog = inject(ConfirmDialogService);
  private snackBar = inject(MatSnackBar);

  // State
  roles = signal<AdminRole[]>([]);
  permissions = signal<Permission[]>([]);
  isLoading = signal(false);

  permissionCategories = signal<{ name: string; permissions: Permission[] }[]>([]);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    forkJoin({
      roles: this.adminService.getRoles(),
      permissions: this.adminService.getPermissions()
    }).subscribe({
      next: ({ roles, permissions }) => {
        this.roles.set(roles);
        this.permissions.set(permissions);
        this.groupPermissionsByCategory(permissions);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading data:', error);
        this.snackBar.open('Failed to load roles', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  private groupPermissionsByCategory(permissions: Permission[]): void {
    const categories: { [key: string]: Permission[] } = {};

    permissions.forEach(perm => {
      const category = perm.value.split('.')[0];
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(perm);
    });

    this.permissionCategories.set(
      Object.entries(categories).map(([name, perms]) => ({
        name,
        permissions: perms
      }))
    );
  }

  getRoleClass(name: string): string {
    return name.toLowerCase();
  }

  getRoleIcon(name: string): string {
    switch (name.toLowerCase()) {
      case 'admin': return 'admin_panel_settings';
      case 'captain': return 'military_tech';
      case 'player': return 'sports_cricket';
      default: return 'person';
    }
  }

  getPermissionIcon(permission: string): string {
    const category = permission.split('.')[0].toLowerCase();
    switch (category) {
      case 'players': return 'groups';
      case 'teams': return 'group_work';
      case 'fixtures': return 'event';
      case 'admin': return 'admin_panel_settings';
      default: return 'check_circle';
    }
  }

  getPermissionCategory(permission: string): string {
    return permission.split('.')[0].toLowerCase();
  }

  getAvailablePermissions(role: AdminRole): Permission[] {
    return this.permissions().filter(p => !role.permissions.includes(p.value));
  }

  addPermission(role: AdminRole, permission: string): void {
    this.adminService.addPermissionToRole(role.name, { permission }).subscribe({
      next: () => {
        this.snackBar.open(`Permission "${permission}" added to ${role.name}`, 'Close', { duration: 3000 });
        this.loadData();
      },
      error: (error) => {
        console.error('Error adding permission:', error);
        this.snackBar.open('Failed to add permission', 'Close', { duration: 3000 });
      }
    });
  }

  removePermission(role: AdminRole, permission: string): void {
    this.confirmDialog.confirmAction(
      'Remove Permission',
      `Remove "${permission}" from ${role.name}?`,
      'Remove'
    ).subscribe(confirmed => {
      if (confirmed) {
        this.adminService.removePermissionFromRole(role.name, permission).subscribe({
          next: () => {
            this.snackBar.open(`Permission "${permission}" removed from ${role.name}`, 'Close', { duration: 3000 });
            this.loadData();
          },
          error: (error) => {
            console.error('Error removing permission:', error);
            this.snackBar.open('Failed to remove permission', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }
}
