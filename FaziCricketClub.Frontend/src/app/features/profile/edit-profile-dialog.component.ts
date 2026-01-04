import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface EditProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

@Component({
  selector: 'app-edit-profile-dialog',
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
        <mat-icon class="header-icon">person</mat-icon>
        <h2 mat-dialog-title>Edit Profile</h2>
      </div>

      <mat-dialog-content>
        <form [formGroup]="profileForm" class="profile-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>First Name</mat-label>
            <input matInput formControlName="firstName" placeholder="Enter your first name">
            @if (profileForm.get('firstName')?.hasError('required') && profileForm.get('firstName')?.touched) {
              <mat-error>First name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Last Name</mat-label>
            <input matInput formControlName="lastName" placeholder="Enter your last name">
            @if (profileForm.get('lastName')?.hasError('required') && profileForm.get('lastName')?.touched) {
              <mat-error>Last name is required</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" placeholder="Enter your email" type="email">
            @if (profileForm.get('email')?.hasError('required') && profileForm.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
            @if (profileForm.get('email')?.hasError('email') && profileForm.get('email')?.touched) {
              <mat-error>Please enter a valid email</mat-error>
            }
          </mat-form-field>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-raised-button
                color="primary"
                [disabled]="!profileForm.valid"
                (click)="save()">
          <mat-icon>save</mat-icon>
          Save Changes
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      min-width: 400px;
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

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .full-width {
      width: 100%;
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
export class EditProfileDialogComponent {
  private dialogRef = inject(MatDialogRef<EditProfileDialogComponent>);
  private data: EditProfileData = inject(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);

  profileForm: FormGroup = this.fb.group({
    firstName: [this.data.firstName, Validators.required],
    lastName: [this.data.lastName, Validators.required],
    email: [this.data.email, [Validators.required, Validators.email]]
  });

  save(): void {
    if (this.profileForm.valid) {
      this.dialogRef.close(this.profileForm.value);
    }
  }
}
