import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth guard to protect routes that require authentication
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login with return URL
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

/**
 * Permission-based guard
 * Usage: canActivate: [permissionGuard], data: { permission: 'Players.Edit' }
 */
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredPermission = route.data['permission'] as string;
  if (!requiredPermission) {
    return true; // No specific permission required
  }

  if (authService.hasPermission(requiredPermission)) {
    return true;
  }

  // Redirect to unauthorized page
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Role-based guard
 * Usage: canActivate: [roleGuard], data: { role: 'Admin' }
 */
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const requiredRole = route.data['role'] as string;
  if (!requiredRole) {
    return true; // No specific role required
  }

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  // Redirect to unauthorized page
  router.navigate(['/unauthorized']);
  return false;
};
