import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Functional HTTP interceptor that adds JWT token to requests
 * and handles 401 unauthorized responses
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Skip adding token for auth endpoints (login/register)
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Get the token
  const token = authService.getToken();

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid - logout and redirect to login
        authService.logout();
        router.navigate(['/auth/login'], {
          queryParams: { returnUrl: router.url, reason: 'session_expired' }
        });
      }
      return throwError(() => error);
    })
  );
};

/**
 * Check if the URL is an authentication endpoint
 */
function isAuthEndpoint(url: string): boolean {
  const authEndpoints = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/reset-password'
  ];

  return authEndpoints.some(endpoint => url.includes(endpoint));
}

/**
 * Error interceptor for handling API errors globally
 */
export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 0:
            errorMessage = 'Unable to connect to the server. Please check your internet connection.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Bad request. Please check your input.';
            break;
          case 403:
            errorMessage = 'You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = 'The requested resource was not found.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error: ${error.status}`;
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url
      });

      return throwError(() => ({
        ...error,
        errorMessage
      }));
    })
  );
};

/**
 * Correlation ID interceptor for request tracing
 */
export const correlationIdInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Generate a unique correlation ID for request tracing
  const correlationId = generateCorrelationId();

  const correlatedReq = req.clone({
    setHeaders: {
      'X-Correlation-ID': correlationId
    }
  });

  return next(correlatedReq);
};

/**
 * Generate a unique correlation ID
 */
function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Content-Type interceptor for setting default headers
 */
export const contentTypeInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Skip if content type is already set or if it's a file upload
  if (req.headers.has('Content-Type') || req.body instanceof FormData) {
    return next(req);
  }

  // Set default content type for requests with body
  if (req.body) {
    const jsonReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json'
      }
    });
    return next(jsonReq);
  }

  return next(req);
};
