import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../../core/auth/auth.service';
import { RegisterRequest } from '../../../shared/models';

@Component({
  selector: 'app-register',
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
          <p>Join Our Cricket Community</p>
        </div>
        <div class="auth-features">
          <div class="feature-item">
            <mat-icon>verified</mat-icon>
            <div>
              <h4>Easy Registration</h4>
              <p>Quick and simple signup process</p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>security</mat-icon>
            <div>
              <h4>Secure Platform</h4>
              <p>Your data is protected and private</p>
            </div>
          </div>
          <div class="feature-item">
            <mat-icon>support_agent</mat-icon>
            <div>
              <h4>24/7 Support</h4>
              <p>We're here to help whenever you need</p>
            </div>
          </div>
        </div>
      </div>

      <div class="auth-right">
        <div class="auth-card">
          <div class="auth-header">
            <h2>Create Account</h2>
            <p>Join FaziCricketClub today</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">First Name</label>
                <mat-form-field appearance="outline" class="full-width">
                  <input matInput formControlName="firstName" placeholder="First name">
                  @if (registerForm.get('firstName')?.hasError('required') && registerForm.get('firstName')?.touched) {
                    <mat-error>First name is required</mat-error>
                  }
                </mat-form-field>
              </div>
              <div class="form-group">
                <label class="form-label">Last Name</label>
                <mat-form-field appearance="outline" class="full-width">
                  <input matInput formControlName="lastName" placeholder="Last name">
                  @if (registerForm.get('lastName')?.hasError('required') && registerForm.get('lastName')?.touched) {
                    <mat-error>Last name is required</mat-error>
                  }
                </mat-form-field>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-icon matPrefix>email</mat-icon>
                <input matInput formControlName="email" type="email" placeholder="Enter your email">
                @if (registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched) {
                  <mat-error>Email is required</mat-error>
                }
                @if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched) {
                  <mat-error>Please enter a valid email</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput formControlName="password" [type]="hidePassword() ? 'password' : 'text'" placeholder="Create a password">
                <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                  <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched) {
                  <mat-error>Password is required</mat-error>
                }
                @if (registerForm.get('password')?.hasError('minlength') && registerForm.get('password')?.touched) {
                  <mat-error>Password must be at least 8 characters</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <mat-form-field appearance="outline" class="full-width">
                <mat-icon matPrefix>lock</mat-icon>
                <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword() ? 'password' : 'text'" placeholder="Confirm your password">
                <button mat-icon-button matSuffix type="button" (click)="hideConfirmPassword.set(!hideConfirmPassword())">
                  <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
                @if (registerForm.get('confirmPassword')?.hasError('required') && registerForm.get('confirmPassword')?.touched) {
                  <mat-error>Please confirm your password</mat-error>
                }
              </mat-form-field>
            </div>

            <div class="form-terms">
              <mat-checkbox formControlName="acceptTerms">
                I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              </mat-checkbox>
            </div>

            @if (registerForm.hasError('passwordMismatch')) {
              <div class="error-message">
                <mat-icon>error</mat-icon>
                Passwords do not match
              </div>
            }

            <button type="submit" class="btn btn-primary btn-lg full-width" [disabled]="authService.isLoading() || registerForm.invalid">
              @if (authService.isLoading()) {
                <mat-spinner diameter="20"></mat-spinner>
                Creating Account...
              } @else {
                Create Account
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
            <p>Already have an account? <a routerLink="/auth/login">Sign In</a></p>
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
      max-width: 500px;
      background: white;
      border-radius: 16px;
      padding: 40px;
      box-shadow: var(--shadow-card);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 28px;
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

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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

    .form-terms {
      font-size: 14px;
    }

    .form-terms a {
      color: var(--app-primary);
      text-decoration: none;
    }

    .form-terms a:hover {
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

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  hidePassword = signal(true);
  hideConfirmPassword = signal(true);

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  /**
   * Custom validator to check if password and confirmPassword match
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const registerData: RegisterRequest = {
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword,
        firstName: formValue.firstName,
        lastName: formValue.lastName
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.snackBar.open(`Welcome to FaziCricketClub, ${response.user.userName}!`, 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });

          // Registration auto-logs in, so navigate to dashboard
          this.router.navigateByUrl('/dashboard');
        },
        error: (error) => {
          // Error is already handled by AuthService and displayed in template
          console.error('Registration failed:', error);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
    }
  }
}
