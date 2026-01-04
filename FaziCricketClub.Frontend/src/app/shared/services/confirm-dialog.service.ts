import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogData } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {
  private dialog = inject(MatDialog);

  /**
   * Open a confirmation dialog
   */
  confirm(data: ConfirmDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data,
      panelClass: 'confirm-dialog-panel',
      disableClose: true
    });

    return dialogRef.afterClosed();
  }

  /**
   * Confirm delete action
   */
  confirmDelete(itemName: string, itemType: string = 'item'): Observable<boolean> {
    return this.confirm({
      title: `Delete ${itemType}?`,
      message: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      icon: 'delete'
    });
  }

  /**
   * Confirm deactivation
   */
  confirmDeactivate(itemName: string): Observable<boolean> {
    return this.confirm({
      title: 'Deactivate?',
      message: `Are you sure you want to deactivate "${itemName}"?`,
      confirmText: 'Deactivate',
      cancelText: 'Cancel',
      type: 'warning',
      icon: 'block'
    });
  }

  /**
   * Confirm action with custom message
   */
  confirmAction(title: string, message: string, confirmText: string = 'Confirm'): Observable<boolean> {
    return this.confirm({
      title,
      message,
      confirmText,
      cancelText: 'Cancel',
      type: 'warning'
    });
  }
}
