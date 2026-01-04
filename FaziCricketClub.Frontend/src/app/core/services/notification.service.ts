import { Injectable, signal, computed } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  action?: string;
  duration?: number;
  timestamp: Date;
  read: boolean;
  persistent?: boolean;
}

export interface NotificationOptions {
  action?: string;
  duration?: number;
  persistent?: boolean;
  onAction?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = signal<Notification[]>([]);
  private notificationQueue: Notification[] = [];
  private isProcessing = false;

  // Computed signals for UI
  allNotifications = computed(() => this.notifications());
  unreadCount = computed(() => this.notifications().filter(n => !n.read).length);
  hasUnread = computed(() => this.unreadCount() > 0);

  // Default configurations for each type
  private readonly typeConfigs: Record<NotificationType, Partial<MatSnackBarConfig>> = {
    success: { duration: 3000, panelClass: ['notification-success'] },
    error: { duration: 5000, panelClass: ['notification-error'] },
    warning: { duration: 4000, panelClass: ['notification-warning'] },
    info: { duration: 3000, panelClass: ['notification-info'] }
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Show a success notification
   */
  success(message: string, options?: NotificationOptions): void {
    this.show(message, 'success', options);
  }

  /**
   * Show an error notification
   */
  error(message: string, options?: NotificationOptions): void {
    this.show(message, 'error', { duration: 5000, ...options });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, options?: NotificationOptions): void {
    this.show(message, 'warning', options);
  }

  /**
   * Show an info notification
   */
  info(message: string, options?: NotificationOptions): void {
    this.show(message, 'info', options);
  }

  /**
   * Show a notification with full control
   */
  show(message: string, type: NotificationType, options?: NotificationOptions): void {
    const notification: Notification = {
      id: this.generateId(),
      message,
      type,
      action: options?.action,
      duration: options?.duration ?? this.typeConfigs[type].duration,
      timestamp: new Date(),
      read: false,
      persistent: options?.persistent
    };

    // Add to notification history
    this.notifications.update(list => [notification, ...list].slice(0, 50)); // Keep last 50

    // Queue the snackbar
    this.queueSnackbar(notification, options?.onAction);
  }

  /**
   * Queue snackbar notifications to prevent overlapping
   */
  private queueSnackbar(notification: Notification, onAction?: () => void): void {
    this.notificationQueue.push(notification);
    this.processQueue(onAction);
  }

  /**
   * Process the notification queue
   */
  private processQueue(onAction?: () => void): void {
    if (this.isProcessing || this.notificationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const notification = this.notificationQueue.shift()!;

    const config: MatSnackBarConfig = {
      ...this.typeConfigs[notification.type],
      duration: notification.persistent ? 0 : notification.duration,
      horizontalPosition: 'end',
      verticalPosition: 'bottom'
    };

    const snackBarRef = this.snackBar.open(
      notification.message,
      notification.action || (notification.persistent ? 'Dismiss' : undefined),
      config
    );

    if (onAction && notification.action) {
      snackBarRef.onAction().subscribe(() => {
        onAction();
      });
    }

    snackBarRef.afterDismissed().subscribe(() => {
      this.isProcessing = false;
      // Small delay before processing next notification
      setTimeout(() => this.processQueue(), 300);
    });
  }

  /**
   * Mark a notification as read
   */
  markAsRead(id: string): void {
    this.notifications.update(list =>
      list.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.update(list =>
      list.map(n => ({ ...n, read: true }))
    );
  }

  /**
   * Remove a notification
   */
  remove(id: string): void {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.set([]);
  }

  /**
   * Get notifications by type
   */
  getByType(type: NotificationType): Notification[] {
    return this.notifications().filter(n => n.type === type);
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
