import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { AuthService } from '../auth/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  requiredRole?: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="app-layout">
      <!-- Header -->
      <header class="app-header">
        <div class="header-left">
          <button mat-icon-button (click)="toggleSidebar()" class="menu-toggle">
            <mat-icon>{{ sidebarExpanded() ? 'menu_open' : 'menu' }}</mat-icon>
          </button>
          <div class="brand">
            <div class="brand-logo">
              <mat-icon class="cricket-icon">sports_cricket</mat-icon>
            </div>
            <div class="brand-text" [class.hidden]="!sidebarExpanded()">
              <span class="brand-name">FaziCricketClub</span>
              <span class="brand-tagline">Club Management</span>
            </div>
          </div>
        </div>

        <div class="header-center">
          <div class="search-box">
            <mat-icon class="search-icon">search</mat-icon>
            <input type="text" placeholder="Search members, matches, teams..." class="search-input" />
          </div>
        </div>

        <div class="header-right">
          <button mat-icon-button matTooltip="Notifications" class="header-icon-btn">
            <mat-icon>notifications</mat-icon>
            <span class="notification-badge">3</span>
          </button>

          <button mat-icon-button matTooltip="Messages" class="header-icon-btn">
            <mat-icon>mail</mat-icon>
          </button>

          <div class="user-menu">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn">
              <div class="user-avatar">
                <span class="avatar-initials">{{ userInitials() }}</span>
              </div>
              <span class="user-name">{{ displayName() }}</span>
              <mat-icon class="dropdown-icon">expand_more</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="user-dropdown">
              <div class="user-info-header">
                <div class="user-avatar-lg">
                  <span>{{ userInitials() }}</span>
                </div>
                <div class="user-details">
                  <span class="user-full-name">{{ displayName() }}</span>
                  <span class="user-email">{{ authService.currentUser()?.email }}</span>
                  <span class="user-role">{{ primaryRole() }}</span>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>My Profile</span>
              </button>
              <button mat-menu-item routerLink="/settings">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item class="logout-btn" (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Sign Out</span>
              </button>
            </mat-menu>
          </div>
        </div>
      </header>

      <!-- Main Container -->
      <div class="app-container">
        <!-- Sidebar -->
        <aside class="app-sidebar" [class.expanded]="sidebarExpanded()" [class.collapsed]="!sidebarExpanded()">
          <nav class="sidebar-nav">
            <div class="nav-section">
              <span class="nav-section-title" *ngIf="sidebarExpanded()">Main</span>
              @for (item of mainNavItems; track item.route) {
                <a [routerLink]="item.route"
                   routerLinkActive="active"
                   class="nav-item"
                   [matTooltip]="!sidebarExpanded() ? item.label : ''"
                   matTooltipPosition="right">
                  <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                  <span class="nav-label" *ngIf="sidebarExpanded()">{{ item.label }}</span>
                </a>
              }
            </div>

            <div class="nav-section">
              <span class="nav-section-title" *ngIf="sidebarExpanded()">Management</span>
              @for (item of managementNavItems; track item.route) {
                <a [routerLink]="item.route"
                   routerLinkActive="active"
                   class="nav-item"
                   [matTooltip]="!sidebarExpanded() ? item.label : ''"
                   matTooltipPosition="right">
                  <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                  <span class="nav-label" *ngIf="sidebarExpanded()">{{ item.label }}</span>
                </a>
              }
            </div>

            @if (isAdmin()) {
              <div class="nav-section">
                <span class="nav-section-title" *ngIf="sidebarExpanded()">Administration</span>
                @for (item of adminNavItems; track item.route) {
                  <a [routerLink]="item.route"
                     routerLinkActive="active"
                     class="nav-item"
                     [matTooltip]="!sidebarExpanded() ? item.label : ''"
                     matTooltipPosition="right">
                    <mat-icon class="nav-icon">{{ item.icon }}</mat-icon>
                    <span class="nav-label" *ngIf="sidebarExpanded()">{{ item.label }}</span>
                  </a>
                }
              </div>
            }
          </nav>

          <!-- Sidebar Footer -->
          <div class="sidebar-footer" *ngIf="sidebarExpanded()">
            <div class="app-version">
              <mat-icon>info</mat-icon>
              <span>Version 1.0.0</span>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="app-main" [class.sidebar-expanded]="sidebarExpanded()">
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--app-surface-alt);
    }

    /* Header Styles */
    .app-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 16px;
      background: linear-gradient(135deg, #2eb82e 0%, #1c961c 100%);
      color: white;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .menu-toggle {
      color: white;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cricket-icon {
      font-size: 24px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      transition: opacity 0.2s ease;
    }

    .brand-text.hidden {
      opacity: 0;
      width: 0;
      overflow: hidden;
    }

    .brand-name {
      font-family: 'Montserrat', sans-serif;
      font-weight: 700;
      font-size: 18px;
      letter-spacing: -0.5px;
    }

    .brand-tagline {
      font-size: 11px;
      opacity: 0.8;
      letter-spacing: 0.5px;
    }

    .header-center {
      flex: 1;
      display: flex;
      justify-content: center;
      max-width: 500px;
      margin: 0 24px;
    }

    .search-box {
      position: relative;
      width: 100%;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(255, 255, 255, 0.7);
      font-size: 20px;
    }

    .search-input {
      width: 100%;
      padding: 10px 16px 10px 44px;
      border: none;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .search-input:focus {
      outline: none;
      background: rgba(255, 255, 255, 0.25);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-icon-btn {
      color: white;
      position: relative;
    }

    .notification-badge {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 18px;
      height: 18px;
      background: #ffc107;
      color: #1e293b;
      border-radius: 50%;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-menu {
      margin-left: 8px;
    }

    .user-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      padding: 4px 8px 4px 4px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
    }

    .user-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name {
      font-weight: 500;
      font-size: 14px;
    }

    .avatar-initials {
      font-size: 12px;
      font-weight: 600;
    }

    .dropdown-icon {
      font-size: 18px;
      opacity: 0.8;
    }

    .user-info-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      min-width: 220px;
    }

    .user-avatar-lg {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #2eb82e 0%, #1c961c 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 16px;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .user-full-name {
      font-weight: 600;
      font-size: 14px;
      color: var(--app-text);
    }

    .user-email {
      font-size: 12px;
      color: var(--app-text-secondary);
    }

    .user-role {
      font-size: 11px;
      color: var(--app-primary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Container Styles */
    .app-container {
      display: flex;
      margin-top: 64px;
      min-height: calc(100vh - 64px);
    }

    /* Sidebar Styles */
    .app-sidebar {
      position: fixed;
      top: 64px;
      left: 0;
      bottom: 0;
      background: white;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
      transition: width 0.3s ease;
      z-index: 900;
      display: flex;
      flex-direction: column;
      overflow-x: hidden;
    }

    .app-sidebar.expanded {
      width: 260px;
    }

    .app-sidebar.collapsed {
      width: 72px;
    }

    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }

    .nav-section {
      margin-bottom: 24px;
    }

    .nav-section-title {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: var(--app-text-muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 0 12px;
      margin-bottom: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 8px;
      color: var(--app-text-secondary);
      text-decoration: none;
      transition: all 0.2s ease;
      margin-bottom: 4px;
    }

    .nav-item:hover {
      background: var(--app-surface-alt);
      color: var(--app-primary);
    }

    .nav-item.active {
      background: #e6f7e6;
      color: var(--app-primary);
      font-weight: 500;
    }

    .nav-item.active .nav-icon {
      color: var(--app-primary);
    }

    .nav-icon {
      font-size: 22px;
      width: 24px;
      height: 24px;
    }

    .nav-label {
      font-size: 14px;
      white-space: nowrap;
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid var(--app-divider);
    }

    .app-version {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--app-text-muted);
    }

    .app-version mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    /* Main Content Styles */
    .app-main {
      flex: 1;
      transition: margin-left 0.3s ease;
    }

    .app-main.sidebar-expanded {
      margin-left: 260px;
    }

    .app-main:not(.sidebar-expanded) {
      margin-left: 72px;
    }

    .main-content {
      padding: 24px;
      min-height: calc(100vh - 64px);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .header-center {
        display: none;
      }

      .user-name {
        display: none;
      }

      .brand-text {
        display: none;
      }

      .app-sidebar.expanded {
        width: 260px;
        position: fixed;
      }

      .app-main {
        margin-left: 0 !important;
      }

      .app-main.sidebar-expanded {
        margin-left: 0;
      }
    }
  `]
})
export class LayoutComponent {
  authService = inject(AuthService);
  sidebarExpanded = signal(true);

  // Computed properties for user display
  displayName = computed(() => {
    const user = this.authService.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.userName || 'User';
  });

  userInitials = computed(() => {
    const user = this.authService.currentUser();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.userName) {
      return user.userName.substring(0, 2).toUpperCase();
    }
    return 'U';
  });

  primaryRole = computed(() => {
    const user = this.authService.currentUser();
    if (user?.roles && user.roles.length > 0) {
      return user.roles[0];
    }
    return 'Member';
  });

  isAdmin = computed(() => {
    return this.authService.hasRole('Admin');
  });

  mainNavItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Matches', icon: 'sports_score', route: '/matches' },
    { label: 'Leaderboards', icon: 'leaderboard', route: '/statistics/leaderboards' },
  ];

  managementNavItems: NavItem[] = [
    { label: 'Members', icon: 'groups', route: '/members' },
    { label: 'Teams', icon: 'group_work', route: '/teams' },
    { label: 'Practice Sessions', icon: 'fitness_center', route: '/practice' },
    { label: 'Equipment', icon: 'sports_cricket', route: '/equipment' },
  ];

  adminNavItems: NavItem[] = [
    { label: 'Users', icon: 'manage_accounts', route: '/admin/users' },
    { label: 'Roles', icon: 'admin_panel_settings', route: '/admin/roles' },
    { label: 'Settings', icon: 'settings', route: '/admin/settings' },
  ];

  toggleSidebar(): void {
    this.sidebarExpanded.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }
}
