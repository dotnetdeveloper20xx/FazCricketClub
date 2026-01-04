import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="auth-container">
      <div class="auth-left">
        <div class="auth-brand">
          <div class="brand-logo">
            <mat-icon>sports_cricket</mat-icon>
          </div>
          <h1>FaziCricketClub</h1>
          <p>Club Management System</p>
        </div>
        <div class="auth-features">
          <div class="feature-item">
            <mat-icon>groups</mat-icon>
            <div>
              <h4>Member Management</h4>
              <p>Track all club members and their details</p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>sports_score</mat-icon>
            <div>
              <h4>Match Scheduling</h4>
              <p>Organize and manage cricket matches</p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>emoji_events</mat-icon>
            <div>
              <h4>Performance Tracking</h4>
              <p>Monitor player statistics and achievements</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Welcome Back</h2>
            <p>Sign in to continue to your dashboard</p>
          </div>

          @if (sessionExpiredMessage()) {
            <div class="session-expired-message">
              <mat-icon>info</mat-icon>
              {{ sessionExpiredMessage() }}
            </div>
          }

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-icon matPrefix>email</mat-icon>
                <input matInput formControlName="email" type="email" placeholder="Enter your email">
                @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
                @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Enter your password">
                <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-options">
              <mat-checkbox formControlName="rememberMe">Remember me</mat-checkbox>
              <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="authService.isLoading() || loginForm.invalid">
              @if (authService.isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
                Signing in...
              } @else {
                Sign In
              }
            </button>

            @if (authService.error()) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                {{ authService.error() }}
              </div>
            }
          </form>

          <div class="auth-footer">
            <p>Don't have an account? <a routerLink="/auth/register">Sign Up</a></p>
          </div>

          <!-- Test credentials hint for development -->
          <div class="dev-hint">
            <p><strong>Test Credentials:</strong></p>
            <p>Admin: admin&#64;fazcricket.com / Admin&#64;123</p>
            <p>Captain: captain&#64;fazcricket.com / Captain&#64;123</p>
            <p>Player: player&#64;fazcricket.com / Player&#64;123</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
    }

    .auth-left {
      flex: 1;
      background: linear-gradient(135deg, #2eb82e 0%, #1c961c 50%, #0a640a 100%);
      color: white;
      padding: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .auth-brand {
      margin-bottom: 60px;
    }

    .brand-logo {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
    }

    .brand-logo mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
    }

    .auth-brand h1 {
      font-family: 'Montserrat', sans-serif;
      font-size: 32px;
      font-weight: 700;
      margin: 0 0 8px;
    }

    .auth-brand p {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
    }

    .auth-features {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .feature-item {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .feature-item mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      opacity: 0.9;
    }

    .feature-item h4 {
      margin: 0 0 4px;
      font-size: 16px;
      font-weight: 600;
    }

    .feature-item p {
      margin: 0;
      font-size: 14px;
      opacity: 0.8;
    }

    .auth-right {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      background: var(--app-surface-alt);
    }

    .auth-card {
      width: 100%;
      max-width: 440px;
      background: white;
      border-radius: 16px;
      padding: 48px;
      box-shadow: var(--shadow-card);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .auth-header h2 {
      font-family: 'Montserrat', sans-serif;
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 8px;
      color: var(--app-text);
    }

    .auth-header p {
      color: var(--app-text-secondary);
      margin: 0;
    }

    .session-expired-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #dbeafe;
      color: #1e40af;
      border-radius: 8px;
      font-size: 14px;
      margin-bottom: 20px;
    }

    .session-expired-message mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--app-text);
      margin-bottom: 8px;
    }

    .full-width {
      width: 100%;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .forgot-link {
      font-size: 14px;
      color: var(--app-primary);
      text-decoration: none;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn-lg {
      padding: 14px 24px;
      font-size: 15px;
    }

    .btn mat-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 8px;
      font-size: 14px;
    }

    .error-message mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid var(--app-divider);
    }

    .auth-footer p {
      margin: 0;
      color: var(--app-text-secondary);
    }

    .auth-footer a {
      color: var(--app-primary);
      font-weight: 500;
      text-decoration: none;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    .dev-hint {
      margin-top: 20px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      font-size: 12px;
      color: var(--app-text-muted);
    }

    .dev-hint p {
      margin: 0 0 4px;
    }

    .dev-hint strong {
      color: var(--app-text-secondary);
    }

    @media (max-width: 900px) {
      .auth-left {
        display: none;
      }

      .auth-right {
        padding: 20px;
      }

      .auth-card {
        padding: 32px 24px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  hidePassword = signal(true);
  sessionExpiredMessage = signal('');
  returnUrl = '/dashboard';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Check for return URL and session expired message
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/dashboard';

      if (params['reason'] === 'session_expired') {
        this.sessionExpiredMessage.set('Your session has expired. Please sign in again.');
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.snackBar.open(`Welcome back, ${response.user.userName}!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          // Navigate to return URL or dashboard
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          // Error is already handled by AuthService and displayed in template
          console.error('Login failed:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
