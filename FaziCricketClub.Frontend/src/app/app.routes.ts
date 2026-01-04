import { Routes } from '@angular/router';
import { LayoutComponent } from './core/layout/layout.component';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Auth routes (guest only - redirect to dashboard if logged in)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Protected routes with layout
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard - FaziCricketClub'
      },
      {
        path: 'members',
        loadComponent: () => import('./features/members/members-list.component').then(m => m.MembersListComponent),
        title: 'Members - FaziCricketClub'
      },
      {
        path: 'members/:id',
        loadComponent: () => import('./features/members/member-detail.component').then(m => m.MemberDetailComponent),
        title: 'Member Details - FaziCricketClub'
      },
      {
        path: 'teams',
        loadComponent: () => import('./features/teams/teams-list.component').then(m => m.TeamsListComponent),
        title: 'Teams - FaziCricketClub'
      },
      {
        path: 'teams/:id',
        loadComponent: () => import('./features/teams/team-detail.component').then(m => m.TeamDetailComponent),
        title: 'Team Details - FaziCricketClub'
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        title: 'My Profile - FaziCricketClub'
      },
      {
        path: 'matches',
        loadComponent: () => import('./features/matches/matches-list.component').then(m => m.MatchesListComponent),
        title: 'Matches - FaziCricketClub'
      },
      {
        path: 'matches/:id',
        loadComponent: () => import('./features/matches/match-detail.component').then(m => m.MatchDetailComponent),
        title: 'Match Details - FaziCricketClub'
      },
      {
        path: 'seasons',
        loadComponent: () => import('./features/seasons/seasons-list.component').then(m => m.SeasonsListComponent),
        title: 'Seasons - FaziCricketClub'
      },
      // Statistics routes
      {
        path: 'statistics',
        children: [
          {
            path: 'leaderboards',
            loadComponent: () => import('./features/statistics/leaderboards.component').then(m => m.LeaderboardsComponent),
            title: 'Leaderboards - FaziCricketClub'
          },
          {
            path: 'analytics',
            loadComponent: () => import('./features/statistics/analytics.component').then(m => m.AnalyticsComponent),
            title: 'Analytics - FaziCricketClub'
          },
          {
            path: 'player/:id',
            loadComponent: () => import('./features/statistics/player-stats.component').then(m => m.PlayerStatsComponent),
            title: 'Player Statistics - FaziCricketClub'
          },
          {
            path: '',
            redirectTo: 'leaderboards',
            pathMatch: 'full'
          }
        ]
      },
      // User settings
      {
        path: 'settings',
        loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
        title: 'Settings - FaziCricketClub'
      },
      // Admin routes
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: 'users',
            loadComponent: () => import('./features/admin/users/users-list.component').then(m => m.UsersListComponent),
            title: 'User Management - FaziCricketClub'
          },
          {
            path: 'roles',
            loadComponent: () => import('./features/admin/roles/roles-list.component').then(m => m.RolesListComponent),
            title: 'Role Management - FaziCricketClub'
          },
          {
            path: 'settings',
            loadComponent: () => import('./features/admin/settings/admin-settings.component').then(m => m.AdminSettingsComponent),
            title: 'Admin Settings - FaziCricketClub'
          }
        ]
      }
    ]
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    title: 'Unauthorized - FaziCricketClub'
  },

  // Catch-all redirect
  {
    path: '**',
    redirectTo: 'auth/login'
  }
];
