import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon class="header-icon">lock</mat-icon>
        <h2 mat-dialog-title>Change Password</h2>
      </div>

      <mat-dialog-content>
        <form [formGroup]="passwordForm" class="password-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Current Password</mat-label>
            <input matInput
                   formControlName="currentPassword"
                   [type]="showCurrentPassword() ? 'text' : 'password'"
                   placeholder="Enter current password">
            <button mat-icon-button matSuffix type="button" (click)="toggleCurrentPassword()">
              <mat-icon>{{ showCurrentPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (passwordForm.get('currentPassword')?.hasError('required') && passwordForm.get('currentPassword')?.touched) {
              <mat-error>Current password is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input matInput
                   formControlName="newPassword"
                   [type]="showNewPassword() ? 'text' : 'password'"
                   placeholder="Enter new password">
            <button mat-icon-button matSuffix type="button" (click)="toggleNewPassword()">
              <mat-icon>{{ showNewPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (passwordForm.get('newPassword')?.hasError('required') && passwordForm.get('newPassword')?.touched) {
              <mat-error>New password is required</mat-error>
            }
            @if (passwordForm.get('newPassword')?.hasError('minlength') && passwordForm.get('newPassword')?.touched) {
              <mat-error>Password must be at least 8 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirm New Password</mat-label>
            <input matInput
                   formControlName="confirmPassword"
                   [type]="showConfirmPassword() ? 'text' : 'password'"
                   placeholder="Confirm new password">
            <button mat-icon-button matSuffix type="button" (click)="toggleConfirmPassword()">
              <mat-icon>{{ showConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (passwordForm.get('confirmPassword')?.hasError('required') && passwordForm.get('confirmPassword')?.touched) {
              <mat-error>Please confirm your password</mat-error>
            }
            @if (passwordForm.hasError('passwordMismatch') && passwordForm.get('confirmPassword')?.touched) {
              <mat-error>Passwords do not match</mat-error>
            }
          </mat-form-field>

          <div class="password-requirements">
            <p class="requirements-title">Password requirements:</p>
            <ul>
              <li [class.met]="hasMinLength()">At least 8 characters</li>
              <li [class.met]="hasUppercase()">One uppercase letter</li>
              <li [class.met]="hasNumber()">One number</li>
            </ul>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button
                color="primary"
                [disabled]="!passwordForm.valid"
                (click)="save()">
          <mat-icon>lock</mat-icon>
          Change Password
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 380px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px 0;
    }

    .header-icon {
      color: var(--app-primary);
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    mat-dialog-content {
      padding-top: 20px;
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .full-width {
      width: 100%;
    }

    .password-requirements {
      background: var(--app-background);
      border-radius: 8px;
      padding: 12px 16px;
      margin-top: 8px;
    }

    .requirements-title {
      font-size: 13px;
      font-weight: 500;
      color: var(--app-text-secondary);
      margin: 0 0 8px;
    }

    .password-requirements ul {
      margin: 0;
      padding-left: 20px;
    }

    .password-requirements li {
      font-size: 12px;
      color: var(--app-text-secondary);
      margin-bottom: 4px;
      transition: color 0.2s ease;
    }

    .password-requirements li.met {
      color: var(--app-primary);
    }

    .password-requirements li.met::marker {
      color: var(--app-primary);
    }

    mat-dialog-actions {
      padding: 16px 24px;
      gap: 8px;
    }

    mat-dialog-actions button mat-icon {
      margin-right: 4px;
    }
  `]
})
export class ChangePasswordDialogComponent {
  private dialogRef = inject(MatDialogRef<ChangePasswordDialogComponent>);
  private fb = inject(FormBuilder);

  showCurrentPassword = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  toggleCurrentPassword(): void {
    this.showCurrentPassword.update(v => !v);
  }

  toggleNewPassword(): void {
    this.showNewPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');

    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  hasMinLength(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value || '';
    return newPassword.length >= 8;
  }

  hasUppercase(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value || '';
    return /[A-Z]/.test(newPassword);
  }

  hasNumber(): boolean {
    const newPassword = this.passwordForm.get('newPassword')?.value || '';
    return /[0-9]/.test(newPassword);
  }

  save(): void {
    if (this.passwordForm.valid) {
      this.dialogRef.close(this.passwordForm.value);
    }
  }
}
