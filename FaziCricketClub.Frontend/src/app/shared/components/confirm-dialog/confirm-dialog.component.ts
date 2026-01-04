import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  icon?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header" [class]="data.type || 'warning'">
        <div class="dialog-icon">
          <mat-icon>{{ getIcon() }}</mat-icon>
        </div>
        <h2 class="dialog-title">{{ data.title }}</h2>
      </div>
      <div class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
      </div>
      <div class="dialog-actions">
        <button mat-stroked-button (click)="onCancel()">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-flat-button [color]="getButtonColor()" (click)="onConfirm()">
          {{ data.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      min-width: 350px;
      max-width: 450px;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px 24px 16px;
    }

    .dialog-header.warning {
      color: #f57c00;
    }

    .dialog-header.danger {
      color: #d32f2f;
    }

    .dialog-header.info {
      color: #1976d2;
    }

    .dialog-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dialog-header.warning .dialog-icon {
      background: rgba(255, 152, 0, 0.12);
    }

    .dialog-header.danger .dialog-icon {
      background: rgba(244, 67, 54, 0.12);
    }

    .dialog-header.info .dialog-icon {
      background: rgba(25, 118, 210, 0.12);
    }

    .dialog-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .dialog-title {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--app-text, #1e293b);
    }

    .dialog-content {
      padding: 0 24px 24px;
    }

    .dialog-message {
      margin: 0;
      font-size: 15px;
      color: var(--app-text-secondary, #64748b);
      line-height: 1.5;
    }

    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--app-border, #e2e8f0);
      background: var(--app-background, #f8fafc);
    }
  `]
})
export class ConfirmDialogComponent {
  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  getIcon(): string {
    if (this.data.icon) return this.data.icon;
    switch (this.data.type) {
      case 'danger': return 'error';
      case 'info': return 'info';
      default: return 'warning';
    }
  }

  getButtonColor(): 'primary' | 'warn' {
    return this.data.type === 'danger' ? 'warn' : 'primary';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
