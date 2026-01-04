import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-matches-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Matches</h1>
          <p class="page-description">View and manage cricket matches</p>
        </div>
        <button class="btn btn-primary">
          <mat-icon>add_circle</mat-icon>
          Schedule Match
        </button>
      </div>

      <div class="card">
        <div class="placeholder-content">
          <mat-icon class="placeholder-icon">sports_score</mat-icon>
          <h3>Matches List Coming Soon</h3>
          <p>This page will display all matches with scheduling, scores, and match details.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px;
    }

    .page-description {
      color: var(--app-text-secondary);
      margin: 0;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .placeholder-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .placeholder-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--app-primary);
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .placeholder-content h3 {
      margin: 0 0 8px;
      color: var(--app-text);
    }

    .placeholder-content p {
      margin: 0;
      color: var(--app-text-secondary);
      max-width: 400px;
    }
  `]
})
export class MatchesListComponent {}
