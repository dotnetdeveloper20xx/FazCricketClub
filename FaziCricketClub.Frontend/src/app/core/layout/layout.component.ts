import { Component, signal, computed, inject, ElementRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { SearchService, SearchResult } from '../services/search.service';
import { ThemeService } from '../services/theme.service';

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
    FormsModule,
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
    MatDividerModule,
    MatProgressSpinnerModule
  ],
  template: `
    <a href="#main-content" class="skip-to-content">Skip to main content</a>
    <div class="app-layout">
      <!-- Header -->
      <header class="app-header" role="banner">
        <div class="header-left">
          <button mat-icon-button
                  (click)="toggleSidebar()"
                  class="menu-toggle"
                  [attr.aria-label]="sidebarExpanded() ? 'Collapse sidebar' : 'Expand sidebar'"
                  [attr.aria-expanded]="sidebarExpanded()">
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
          <div class="search-box" #searchContainer role="search">
            <mat-icon class="search-icon" aria-hidden="true">search</mat-icon>
            <input type="text"
                   placeholder="Search members, matches, teams..."
                   class="search-input"
                   [(ngModel)]="searchQuery"
                   (input)="onSearchInput()"
                   (focus)="showSearchResults = true"
                   (keydown.escape)="closeSearch()"
                   (keydown.enter)="navigateToFirstResult()"
                   aria-label="Search members, matches, teams"
                   aria-autocomplete="list"
                   [attr.aria-expanded]="showSearchResults"
                   aria-controls="search-results" />
            @if (isSearching()) {
              <mat-spinner diameter="20" class="search-spinner"></mat-spinner>
            }
            @if (showSearchResults && (searchResults().length > 0 || searchQuery.length >= 2)) {
              <div class="search-results" id="search-results" role="listbox" aria-label="Search results">
                @if (searchResults().length === 0 && searchQuery.length >= 2) {
                  <div class="search-empty">
                    <mat-icon>search_off</mat-icon>
                    <span>No results found for "{{ searchQuery }}"</span>
                  </div>
                } @else {
                  @for (result of searchResults(); track result.id + result.type) {
                    <a class="search-result-item" [routerLink]="result.route" (click)="closeSearch()">
                      <mat-icon class="result-icon" [class]="result.type">{{ result.icon }}</mat-icon>
                      <div class="result-content">
                        <span class="result-title">{{ result.title }}</span>
                        <span class="result-subtitle">{{ result.subtitle }}</span>
                      </div>
                      <span class="result-type">{{ result.type }}</span>
                    </a>
                  }
                }
              </div>
            }
          </div>
        </div>

        <div class="header-right">
          <button mat-icon-button
                  [matTooltip]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                  [attr.aria-label]="themeService.isDarkMode() ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
                  class="header-icon-btn theme-toggle"
                  (click)="themeService.toggleTheme()">
            <mat-icon aria-hidden="true">{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <button mat-icon-button matTooltip="Notifications" aria-label="Notifications" class="header-icon-btn">
            <mat-icon aria-hidden="true">notifications</mat-icon>
            <span class="notification-badge" aria-label="3 unread notifications">3</span>
          </button>

          <button mat-icon-button matTooltip="Messages" aria-label="Messages" class="header-icon-btn">
            <mat-icon aria-hidden="true">mail</mat-icon>
          </button>

          <div class="user-menu">
            <button mat-button [matMenuTriggerFor]="userMenu" class="user-btn" aria-label="User menu">
              <div class="user-avatar" aria-hidden="true">
                <span class="avatar-initials">{{ userInitials() }}</span>
              </div>
              <span class="user-name">{{ displayName() }}</span>
              <mat-icon class="dropdown-icon" aria-hidden="true">expand_more</mat-icon>
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
        <aside class="app-sidebar" [class.expanded]="sidebarExpanded()" [class.collapsed]="!sidebarExpanded()" role="complementary" aria-label="Sidebar navigation">
          <nav class="sidebar-nav" aria-label="Main navigation">
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
        <main id="main-content" class="app-main" [class.sidebar-expanded]="sidebarExpanded()" role="main" aria-label="Main content">
          <div class="main-content">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    /* Skip to content link for accessibility */
    .skip-to-content {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--app-primary);
      color: white;
      padding: 8px 16px;
      z-index: 10000;
      text-decoration: none;
      font-weight: 500;
      border-radius: 0 0 4px 0;
      transition: top 0.2s ease;
    }

    .skip-to-content:focus {
      top: 0;
      outline: 2px solid white;
      outline-offset: 2px;
    }

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

    .search-spinner {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
    }

    .search-results {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 8px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      max-height: 400px;
      overflow-y: auto;
      z-index: 1100;
    }

    .search-empty {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      color: #64748b;
    }

    .search-empty mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
      opacity: 0.5;
    }

    .search-result-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      text-decoration: none;
      color: #1e293b;
      transition: background 0.15s ease;
      cursor: pointer;
    }

    .search-result-item:hover {
      background: #f1f5f9;
    }

    .search-result-item:first-child {
      border-radius: 12px 12px 0 0;
    }

    .search-result-item:last-child {
      border-radius: 0 0 12px 12px;
    }

    .result-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .result-icon.member {
      background: rgba(46, 184, 46, 0.15);
      color: #2eb82e;
    }

    .result-icon.team {
      background: rgba(25, 118, 210, 0.15);
      color: #1976d2;
    }

    .result-icon.match {
      background: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }

    .result-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .result-title {
      font-weight: 500;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-subtitle {
      font-size: 12px;
      color: #64748b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .result-type {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 4px 8px;
      background: #f1f5f9;
      border-radius: 4px;
      color: #64748b;
      font-weight: 500;
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
  themeService = inject(ThemeService);
  private searchService = inject(SearchService);
  private router = inject(Router);

  @ViewChild('searchContainer') searchContainer!: ElementRef;

  sidebarExpanded = signal(true);
  searchQuery = '';
  showSearchResults = false;
  isSearching = signal(false);
  searchResults = signal<SearchResult[]>([]);

  private searchSubject = new Subject<string>();

  constructor() {
    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < 2) {
          return of([]);
        }
        this.isSearching.set(true);
        return this.searchService.search(query);
      })
    ).subscribe(results => {
      this.searchResults.set(results);
      this.isSearching.set(false);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.searchContainer && !this.searchContainer.nativeElement.contains(event.target)) {
      this.closeSearch();
    }
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  closeSearch(): void {
    this.showSearchResults = false;
  }

  navigateToFirstResult(): void {
    const results = this.searchResults();
    if (results.length > 0) {
      this.router.navigate([results[0].route]);
      this.closeSearch();
      this.searchQuery = '';
    }
  }

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
    { label: 'Analytics', icon: 'analytics', route: '/statistics/analytics' },
  ];

  managementNavItems: NavItem[] = [
    { label: 'Members', icon: 'groups', route: '/members' },
    { label: 'Teams', icon: 'group_work', route: '/teams' },
    { label: 'Seasons', icon: 'date_range', route: '/seasons' },
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
