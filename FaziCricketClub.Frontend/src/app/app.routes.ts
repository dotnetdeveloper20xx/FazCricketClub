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
        path: 'teams',
        loadComponent: () => import('./features/teams/teams-list.component').then(m => m.TeamsListComponent),
        title: 'Teams - FaziCricketClub'
      },
      {
        path: 'matches',
        loadComponent: () => import('./features/matches/matches-list.component').then(m => m.MatchesListComponent),
        title: 'Matches - FaziCricketClub'
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
