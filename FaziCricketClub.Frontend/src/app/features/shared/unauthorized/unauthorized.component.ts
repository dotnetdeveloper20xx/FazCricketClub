import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, MatButtonModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="icon-wrapper">
          <mat-icon>lock</mat-icon>
        </div>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <p class="sub-text">Please contact your administrator if you believe this is an error.</p>
        <div class="actions">
          <a routerLink="/dashboard" class="btn btn-primary">
            <mat-icon>home</mat-icon>
            Go to Dashboard
          </a>
          <a routerLink="/auth/login" class="btn btn-outline">
            <mat-icon>login</mat-icon>
            Sign In Again
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--app-surface-alt);
      padding: 20px;
    }

    .unauthorized-card {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 16px;
      box-shadow: var(--shadow-card);
      max-width: 450px;
    }

    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: #fee2e2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .icon-wrapper mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #ef4444;
    }

    h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 12px;
      color: var(--app-text);
    }

    p {
      color: var(--app-text-secondary);
      margin: 0 0 8px;
      font-size: 16px;
    }

    .sub-text {
      font-size: 14px;
      color: var(--app-text-muted);
      margin-bottom: 32px;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-decoration: none;
    }
  `]
})
export class UnauthorizedComponent {}
