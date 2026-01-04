import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type SkeletonType = 'text' | 'circle' | 'rect' | 'card' | 'table-row' | 'avatar' | 'button';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-container" [ngStyle]="containerStyle">
      @switch (type) {
        @case ('text') {
          <div class="skeleton skeleton-text" [ngStyle]="{ width: width, height: height }"></div>
        }
        @case ('circle') {
          <div class="skeleton skeleton-circle" [ngStyle]="{ width: width, height: width }"></div>
        }
        @case ('avatar') {
          <div class="skeleton skeleton-circle skeleton-avatar" [ngStyle]="{ width: width || '40px', height: width || '40px' }"></div>
        }
        @case ('rect') {
          <div class="skeleton skeleton-rect" [ngStyle]="{ width: width, height: height }"></div>
        }
        @case ('button') {
          <div class="skeleton skeleton-button" [ngStyle]="{ width: width || '100px', height: height || '36px' }"></div>
        }
        @case ('card') {
          <div class="skeleton-card">
            <div class="skeleton skeleton-rect" style="height: 120px; margin-bottom: 16px;"></div>
            <div class="skeleton skeleton-text" style="width: 80%; margin-bottom: 8px;"></div>
            <div class="skeleton skeleton-text" style="width: 60%;"></div>
          </div>
        }
        @case ('table-row') {
          <div class="skeleton-table-row">
            @for (col of columns; track $index) {
              <div class="skeleton skeleton-text" [ngStyle]="{ width: col }"></div>
            }
          </div>
        }
        @default {
          <div class="skeleton skeleton-text" [ngStyle]="{ width: width, height: height }"></div>
        }
      }
    </div>
  `,
  styles: [`
    .skeleton-container {
      display: inline-block;
      width: 100%;
    }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--skeleton-base, #e0e0e0) 25%,
        var(--skeleton-highlight, #f0f0f0) 50%,
        var(--skeleton-base, #e0e0e0) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 4px;
    }

    .skeleton-text {
      height: 16px;
      width: 100%;
    }

    .skeleton-circle,
    .skeleton-avatar {
      border-radius: 50%;
    }

    .skeleton-rect {
      width: 100%;
      height: 100px;
    }

    .skeleton-button {
      border-radius: 8px;
    }

    .skeleton-card {
      padding: 16px;
      background: var(--app-surface, white);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
    }

    .skeleton-table-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-bottom: 1px solid var(--app-border, #e2e8f0);
    }

    .skeleton-table-row .skeleton {
      height: 14px;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    /* Dark theme support */
    :host-context(.dark-theme) .skeleton {
      --skeleton-base: #2a2a3e;
      --skeleton-highlight: #3f3f5a;
    }

    :host-context(.dark-theme) .skeleton-card {
      background: var(--app-surface);
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() type: SkeletonType = 'text';
  @Input() width: string = '100%';
  @Input() height: string = '16px';
  @Input() count: number = 1;
  @Input() columns: string[] = ['40px', '25%', '20%', '15%', '10%'];

  get containerStyle() {
    return {};
  }
}

// Skeleton group component for multiple skeletons
@Component({
  selector: 'app-skeleton-group',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="skeleton-group" [ngStyle]="{ gap: gap }">
      @for (item of items; track $index) {
        <app-skeleton [type]="type" [width]="width" [height]="height" [columns]="columns"></app-skeleton>
      }
    </div>
  `,
  styles: [`
    .skeleton-group {
      display: flex;
      flex-direction: column;
    }
  `]
})
export class SkeletonGroupComponent {
  @Input() type: SkeletonType = 'text';
  @Input() count: number = 3;
  @Input() width: string = '100%';
  @Input() height: string = '16px';
  @Input() gap: string = '12px';
  @Input() columns: string[] = ['40px', '25%', '20%', '15%', '10%'];

  get items(): number[] {
    return Array(this.count).fill(0);
  }
}

// Dashboard skeleton component
@Component({
  selector: 'app-dashboard-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="dashboard-skeleton">
      <!-- Stats Cards Skeleton -->
      <div class="stats-skeleton">
        @for (i of [1,2,3,4]; track i) {
          <div class="stat-card-skeleton">
            <div class="stat-icon-skeleton">
              <app-skeleton type="rect" width="48px" height="48px"></app-skeleton>
            </div>
            <div class="stat-content-skeleton">
              <app-skeleton type="text" width="60px" height="28px"></app-skeleton>
              <app-skeleton type="text" width="80px" height="14px"></app-skeleton>
            </div>
          </div>
        }
      </div>

      <!-- Charts Skeleton -->
      <div class="charts-skeleton">
        <div class="chart-skeleton">
          <app-skeleton type="text" width="150px" height="20px"></app-skeleton>
          <app-skeleton type="rect" width="100%" height="200px"></app-skeleton>
        </div>
        <div class="chart-skeleton">
          <app-skeleton type="text" width="150px" height="20px"></app-skeleton>
          <app-skeleton type="rect" width="100%" height="200px"></app-skeleton>
        </div>
      </div>

      <!-- Lists Skeleton -->
      <div class="lists-skeleton">
        <div class="list-skeleton">
          <app-skeleton type="text" width="120px" height="18px"></app-skeleton>
          @for (i of [1,2,3,4,5]; track i) {
            <div class="list-item-skeleton">
              <app-skeleton type="avatar" width="36px"></app-skeleton>
              <div class="list-text-skeleton">
                <app-skeleton type="text" width="70%"></app-skeleton>
                <app-skeleton type="text" width="50%" height="12px"></app-skeleton>
              </div>
            </div>
          }
        </div>
        <div class="list-skeleton">
          <app-skeleton type="text" width="120px" height="18px"></app-skeleton>
          @for (i of [1,2,3,4,5]; track i) {
            <div class="list-item-skeleton">
              <app-skeleton type="rect" width="44px" height="44px"></app-skeleton>
              <div class="list-text-skeleton">
                <app-skeleton type="text" width="80%"></app-skeleton>
                <app-skeleton type="text" width="60%" height="12px"></app-skeleton>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-skeleton {
      padding: 24px;
    }

    .stats-skeleton {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card-skeleton {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: var(--app-surface, white);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
    }

    .stat-content-skeleton {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .charts-skeleton {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    .chart-skeleton {
      padding: 20px;
      background: var(--app-surface, white);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .lists-skeleton {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .list-skeleton {
      padding: 20px;
      background: var(--app-surface, white);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .list-item-skeleton {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }

    .list-text-skeleton {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    @media (max-width: 1024px) {
      .stats-skeleton {
        grid-template-columns: repeat(2, 1fr);
      }
      .charts-skeleton,
      .lists-skeleton {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .stats-skeleton {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardSkeletonComponent {}

// Table skeleton component
@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="table-skeleton">
      <!-- Header -->
      <div class="table-header-skeleton">
        @for (col of columnWidths; track $index) {
          <app-skeleton type="text" [width]="col" height="12px"></app-skeleton>
        }
      </div>
      <!-- Rows -->
      @for (row of rows; track $index) {
        <div class="table-row-skeleton">
          @if (showAvatar) {
            <app-skeleton type="avatar" width="40px"></app-skeleton>
          }
          @for (col of columnWidths; track $index) {
            <app-skeleton type="text" [width]="col"></app-skeleton>
          }
          <app-skeleton type="rect" width="32px" height="32px"></app-skeleton>
        </div>
      }
    </div>
  `,
  styles: [`
    .table-skeleton {
      background: var(--app-surface, white);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: var(--shadow-card);
    }

    .table-header-skeleton {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px 24px;
      background: var(--app-surface-alt, #f8fafc);
      border-bottom: 1px solid var(--app-border);
    }

    .table-row-skeleton {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px 24px;
      border-bottom: 1px solid var(--app-divider, #f1f5f9);
    }

    .table-row-skeleton:last-child {
      border-bottom: none;
    }
  `]
})
export class TableSkeletonComponent {
  @Input() rowCount: number = 5;
  @Input() columnWidths: string[] = ['25%', '20%', '15%', '15%'];
  @Input() showAvatar: boolean = true;

  get rows(): number[] {
    return Array(this.rowCount).fill(0);
  }
}

// Detail Page Skeleton Component
@Component({
  selector: 'app-detail-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="detail-skeleton">
      <!-- Header Section -->
      <div class="detail-header-skeleton">
        <div class="header-avatar">
          <app-skeleton type="circle" width="100px"></app-skeleton>
        </div>
        <div class="header-info">
          <app-skeleton type="text" width="250px" height="28px"></app-skeleton>
          <app-skeleton type="text" width="180px" height="16px"></app-skeleton>
          <div class="header-badges">
            <app-skeleton type="rect" width="80px" height="28px"></app-skeleton>
            <app-skeleton type="rect" width="100px" height="28px"></app-skeleton>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="detail-content-skeleton">
        <!-- Main Card -->
        <div class="detail-card-skeleton main">
          <app-skeleton type="text" width="150px" height="20px"></app-skeleton>
          <div class="detail-grid">
            @for (i of [1,2,3,4]; track i) {
              <div class="detail-item-skeleton">
                <app-skeleton type="text" width="60px" height="12px"></app-skeleton>
                <app-skeleton type="text" width="100%" height="16px"></app-skeleton>
              </div>
            }
          </div>
        </div>

        <!-- Side Card -->
        <div class="detail-card-skeleton side">
          <app-skeleton type="text" width="120px" height="18px"></app-skeleton>
          @for (i of [1,2,3]; track i) {
            <div class="side-item-skeleton">
              <app-skeleton type="rect" width="40px" height="40px"></app-skeleton>
              <div class="side-text">
                <app-skeleton type="text" width="80%"></app-skeleton>
                <app-skeleton type="text" width="60%" height="12px"></app-skeleton>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .detail-skeleton {
      padding: 24px;
    }

    .detail-header-skeleton {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 32px;
      background: var(--app-surface, white);
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: var(--shadow-card);
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header-badges {
      display: flex;
      gap: 8px;
    }

    .detail-content-skeleton {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }

    .detail-card-skeleton {
      padding: 24px;
      background: var(--app-surface, white);
      border-radius: 12px;
      box-shadow: var(--shadow-card);
    }

    .detail-card-skeleton.main {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item-skeleton {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: var(--app-background, #f5f5f5);
      border-radius: 8px;
    }

    .detail-card-skeleton.side {
      display: flex;
      flex-direction: column;
      gap: 16px;
      height: fit-content;
    }

    .side-item-skeleton {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--app-background, #f5f5f5);
      border-radius: 8px;
    }

    .side-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    @media (max-width: 1024px) {
      .detail-content-skeleton {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .detail-header-skeleton {
        flex-direction: column;
        text-align: center;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DetailSkeletonComponent {}

// Profile Skeleton Component
@Component({
  selector: 'app-profile-skeleton',
  standalone: true,
  imports: [CommonModule, SkeletonLoaderComponent],
  template: `
    <div class="profile-skeleton">
      <!-- Profile Header -->
      <div class="profile-header-skeleton">
        <app-skeleton type="circle" width="100px"></app-skeleton>
        <div class="profile-header-text">
          <app-skeleton type="text" width="200px" height="28px"></app-skeleton>
          <app-skeleton type="text" width="180px" height="16px"></app-skeleton>
        </div>
      </div>

      <!-- Profile Content -->
      <div class="profile-content-skeleton">
        <div class="profile-main-skeleton">
          <div class="section-skeleton">
            <div class="section-title-skeleton">
              <app-skeleton type="rect" width="24px" height="24px"></app-skeleton>
              <app-skeleton type="text" width="150px" height="18px"></app-skeleton>
            </div>
            <div class="detail-grid-skeleton">
              @for (i of [1,2,3,4]; track i) {
                <div class="detail-item-skeleton">
                  <app-skeleton type="text" width="60px" height="10px"></app-skeleton>
                  <app-skeleton type="text" width="100%"></app-skeleton>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="profile-side-skeleton">
          <app-skeleton type="text" width="120px" height="16px"></app-skeleton>
          @for (i of [1,2,3]; track i) {
            <app-skeleton type="rect" width="100%" height="48px"></app-skeleton>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-skeleton {
      padding: 24px;
    }

    .profile-header-skeleton {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 32px;
      background: linear-gradient(135deg, #e0e0e0, #c0c0c0);
      border-radius: 12px 12px 0 0;
    }

    .profile-header-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .profile-content-skeleton {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
      margin-top: 24px;
    }

    .profile-main-skeleton {
      background: var(--app-surface, white);
      border-radius: 12px;
      padding: 24px;
      box-shadow: var(--shadow-card);
    }

    .section-skeleton {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title-skeleton {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .detail-grid-skeleton {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .detail-item-skeleton {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 16px;
      background: var(--app-background, #f5f5f5);
      border-radius: 8px;
    }

    .profile-side-skeleton {
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--app-surface, white);
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow-card);
      height: fit-content;
    }

    @media (max-width: 1024px) {
      .profile-content-skeleton {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileSkeletonComponent {}
