import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

/**
 * Guard that prevents access to routes if user is not authenticated
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Not authenticated - redirect to login with return URL
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard that prevents access to routes if user IS authenticated
 * (for login/register pages - redirect to dashboard if already logged in)
 */
export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  // Already authenticated - redirect to dashboard
  router.navigate(['/dashboard']);
  return false;
};

/**
 * Guard that checks for specific roles
 */
export const roleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check for required roles from route data
  const requiredRoles = route.data['roles'] as string[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles required
  }

  // Check if user has any of the required roles
  if (authService.hasAnyRole(requiredRoles)) {
    return true;
  }

  // User doesn't have required role - redirect to unauthorized page or dashboard
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Guard that checks for specific permissions
 */
export const permissionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // First check if authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  // Check for required permissions from route data
  const requiredPermissions = route.data['permissions'] as string[] | undefined;
  const requireAll = route.data['requireAllPermissions'] as boolean ?? false;

  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true; // No permissions required
  }

  // Check permissions
  const hasPermission = requireAll
    ? authService.hasAllPermissions(requiredPermissions)
    : requiredPermissions.some(p => authService.hasPermission(p));

  if (hasPermission) {
    return true;
  }

  // User doesn't have required permissions
  router.navigate(['/unauthorized']);
  return false;
};

/**
 * Admin-only guard - shortcut for checking Admin role
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url }
    });
    return false;
  }

  if (authService.hasRole('Admin')) {
    return true;
  }

  router.navigate(['/unauthorized']);
  return false;
};
