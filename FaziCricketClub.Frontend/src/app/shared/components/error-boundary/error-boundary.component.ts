import { Component, Input, Output, EventEmitter, ErrorHandler, Injectable, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface AppError {
  message: string;
  code?: string;
  timestamp: Date;
  stack?: string;
}

@Component({
  selector: 'app-error-boundary',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    @if (hasError()) {
      <div class="error-boundary" role="alert" aria-live="assertive">
        <div class="error-content">
          <div class="error-icon">
            <mat-icon>error_outline</mat-icon>
          </div>
          <h2 class="error-title">{{ title }}</h2>
          <p class="error-message">{{ message }}</p>
          @if (showDetails && errorDetails()) {
            <div class="error-details">
              <button class="details-toggle" (click)="toggleDetails()">
                <mat-icon>{{ showErrorDetails ? 'expand_less' : 'expand_more' }}</mat-icon>
                {{ showErrorDetails ? 'Hide Details' : 'Show Details' }}
              </button>
              @if (showErrorDetails) {
                <pre class="error-stack">{{ errorDetails() }}</pre>
              }
            </div>
          }
          <div class="error-actions">
            @if (showRetry) {
              <button mat-raised-button color="primary" (click)="retry()">
                <mat-icon>refresh</mat-icon>
                Try Again
              </button>
            }
            @if (showHome) {
              <button mat-stroked-button (click)="goHome()">
                <mat-icon>home</mat-icon>
                Go to Dashboard
              </button>
            }
          </div>
        </div>
      </div>
    } @else {
      <ng-content></ng-content>
    }
  `,
  styles: [`
    .error-boundary {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      padding: 40px 20px;
    }

    .error-content {
      text-align: center;
      max-width: 500px;
    }

    .error-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      margin-bottom: 24px;
    }

    .error-icon mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ef4444;
    }

    .error-title {
      font-size: 24px;
      font-weight: 700;
      color: var(--app-text);
      margin: 0 0 12px;
    }

    .error-message {
      font-size: 15px;
      color: var(--app-text-secondary);
      margin: 0 0 24px;
      line-height: 1.6;
    }

    .error-details {
      margin-bottom: 24px;
    }

    .details-toggle {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: var(--app-text-secondary);
      font-size: 13px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .details-toggle:hover {
      background: var(--app-background);
    }

    .details-toggle mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .error-stack {
      text-align: left;
      background: var(--app-background);
      padding: 16px;
      border-radius: 8px;
      font-size: 12px;
      color: var(--app-text-secondary);
      overflow-x: auto;
      margin-top: 12px;
      max-height: 200px;
      overflow-y: auto;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
    }

    .error-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ErrorBoundaryComponent {
  @Input() title = 'Something went wrong';
  @Input() message = 'We encountered an unexpected error. Please try again or contact support if the problem persists.';
  @Input() showRetry = true;
  @Input() showHome = true;
  @Input() showDetails = false;

  @Output() retryClicked = new EventEmitter<void>();
  @Output() homeClicked = new EventEmitter<void>();

  hasError = signal(false);
  errorDetails = signal<string | null>(null);
  showErrorDetails = false;

  setError(error: AppError | Error | string): void {
    this.hasError.set(true);
    if (typeof error === 'string') {
      this.errorDetails.set(error);
    } else if (error instanceof Error) {
      this.errorDetails.set(error.stack || error.message);
    } else {
      this.errorDetails.set(error.stack || error.message);
    }
  }

  clearError(): void {
    this.hasError.set(false);
    this.errorDetails.set(null);
    this.showErrorDetails = false;
  }

  toggleDetails(): void {
    this.showErrorDetails = !this.showErrorDetails;
  }

  retry(): void {
    this.clearError();
    this.retryClicked.emit();
  }

  goHome(): void {
    this.homeClicked.emit();
  }
}

// Global Error Handler Service
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error): void {
    console.error('Global error caught:', error);
    // In production, you would send this to an error tracking service
  }
}

// Empty State Component for reuse
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="empty-state" role="status">
      <div class="empty-icon">
        <mat-icon>{{ icon }}</mat-icon>
      </div>
      <h3 class="empty-title">{{ title }}</h3>
      <p class="empty-message">{{ message }}</p>
      @if (actionLabel) {
        <button mat-raised-button color="primary" (click)="actionClicked.emit()">
          @if (actionIcon) {
            <mat-icon>{{ actionIcon }}</mat-icon>
          }
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--app-background);
      margin-bottom: 20px;
    }

    .empty-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: var(--app-text-muted);
    }

    .empty-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--app-text);
      margin: 0 0 8px;
    }

    .empty-message {
      font-size: 14px;
      color: var(--app-text-secondary);
      margin: 0 0 24px;
      max-width: 400px;
    }

    button mat-icon {
      margin-right: 8px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() icon = 'inbox';
  @Input() title = 'No data found';
  @Input() message = 'There are no items to display at this time.';
  @Input() actionLabel?: string;
  @Input() actionIcon?: string;
  @Output() actionClicked = new EventEmitter<void>();
}

// Loading State Component
@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="loading-state" role="status" aria-live="polite">
      <div class="loading-spinner">
        <div class="spinner"></div>
      </div>
      <p class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .loading-spinner {
      margin-bottom: 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--app-border);
      border-top-color: var(--app-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-message {
      font-size: 14px;
      color: var(--app-text-secondary);
      margin: 0;
    }
  `]
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
}
