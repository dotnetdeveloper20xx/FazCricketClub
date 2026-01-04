import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MembersService } from '../../core/services/members.service';
import { Member, PaginatedResponse } from '../../shared/models';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Members</h1>
          <p class="page-description">Manage club members and their information</p>
        </div>
        <button class="btn btn-primary" (click)="openMemberDialog()">
          <mat-icon>person_add</mat-icon>
          Add Member
        </button>
      </div>

      <!-- Search and Filters -->
      <div class="card filters-card">
        <div class="filters-row">
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Search members</mat-label>
            <input matInput
                   [value]="searchTerm()"
                   (input)="onSearchInput($event)"
                   placeholder="Search by name, email...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <div class="filter-buttons">
            <button mat-stroked-button
                    [class.active]="activeFilter() === 'all'"
                    (click)="setFilter('all')">
              All
            </button>
            <button mat-stroked-button
                    [class.active]="activeFilter() === 'active'"
                    (click)="setFilter('active')">
              Active
            </button>
            <button mat-stroked-button
                    [class.active]="activeFilter() === 'inactive'"
                    (click)="setFilter('inactive')">
              Inactive
            </button>
          </div>
        </div>
      </div>

      <!-- Members Table -->
      <div class="card table-card">
        @if (isLoading()) {
          <div class="loading-container">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Loading members...</p>
          </div>
        } @else if (members().length === 0) {
          <div class="empty-state">
            <mat-icon class="empty-icon">groups</mat-icon>
            <h3>No members found</h3>
            <p>{{ searchTerm() ? 'Try adjusting your search criteria' : 'Get started by adding your first member' }}</p>
            @if (!searchTerm()) {
              <button class="btn btn-primary" (click)="openMemberDialog()">
                <mat-icon>person_add</mat-icon>
                Add Member
              </button>
            }
          </div>
        } @else {
          <div class="table-container">
            <table mat-table [dataSource]="members()" class="members-table">
              <!-- Name Column -->
              <ng-container matColumnDef="fullName">
                <th mat-header-cell *matHeaderCellDef>Name</th>
                <td mat-cell *matCellDef="let member">
                  <a [routerLink]="['/members', member.id]" class="member-name">
                    <div class="avatar">{{ getInitials(member.fullName) }}</div>
                    <span>{{ member.fullName }}</span>
                  </a>
                </td>
              </ng-container>

              <!-- Email Column -->
              <ng-container matColumnDef="email">
                <th mat-header-cell *matHeaderCellDef>Email</th>
                <td mat-cell *matCellDef="let member">{{ member.email }}</td>
              </ng-container>

              <!-- Phone Column -->
              <ng-container matColumnDef="phoneNumber">
                <th mat-header-cell *matHeaderCellDef>Phone</th>
                <td mat-cell *matCellDef="let member">{{ member.phoneNumber || '-' }}</td>
              </ng-container>

              <!-- Joined Date Column -->
              <ng-container matColumnDef="joinedOn">
                <th mat-header-cell *matHeaderCellDef>Joined</th>
                <td mat-cell *matCellDef="let member">{{ member.joinedOn | date:'mediumDate' }}</td>
              </ng-container>

              <!-- Status Column -->
              <ng-container matColumnDef="isActive">
                <th mat-header-cell *matHeaderCellDef>Status</th>
                <td mat-cell *matCellDef="let member">
                  <span class="status-chip" [class.active]="member.isActive" [class.inactive]="!member.isActive">
                    {{ member.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </ng-container>

              <!-- Actions Column -->
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let member">
                  <button mat-icon-button [matMenuTriggerFor]="menu" aria-label="Actions">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #menu="matMenu">
                    <button mat-menu-item (click)="openMemberDialog(member)">
                      <mat-icon>edit</mat-icon>
                      <span>Edit</span>
                    </button>
                    <button mat-menu-item (click)="toggleMemberStatus(member)">
                      <mat-icon>{{ member.isActive ? 'block' : 'check_circle' }}</mat-icon>
                      <span>{{ member.isActive ? 'Deactivate' : 'Activate' }}</span>
                    </button>
                    <button mat-menu-item class="delete-action" (click)="deleteMember(member)">
                      <mat-icon>delete</mat-icon>
                      <span>Delete</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="totalCount()"
            [pageSize]="pageSize()"
            [pageIndex]="pageNumber() - 1"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        }
      </div>

      <!-- Member Dialog (Create/Edit) -->
      @if (showDialog()) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <div class="dialog-content" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{ editingMember() ? 'Edit Member' : 'Add New Member' }}</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <form [formGroup]="memberForm" (ngSubmit)="saveMember()">
              <div class="dialog-body">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Full Name</mat-label>
                  <input matInput formControlName="fullName" placeholder="Enter full name">
                  @if (memberForm.get('fullName')?.hasError('required') && memberForm.get('fullName')?.touched) {
                    <mat-error>Full name is required</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput formControlName="email" type="email" placeholder="Enter email address">
                  @if (memberForm.get('email')?.hasError('required') && memberForm.get('email')?.touched) {
                    <mat-error>Email is required</mat-error>
                  }
                  @if (memberForm.get('email')?.hasError('email') && memberForm.get('email')?.touched) {
                    <mat-error>Invalid email format</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Phone Number</mat-label>
                  <input matInput formControlName="phoneNumber" placeholder="Enter phone number">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Date of Birth</mat-label>
                  <input matInput formControlName="dateOfBirth" type="date">
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Notes</mat-label>
                  <textarea matInput formControlName="notes" rows="3" placeholder="Additional notes"></textarea>
                </mat-form-field>
              </div>
              <div class="dialog-footer">
                <button mat-stroked-button type="button" (click)="closeDialog()">Cancel</button>
                <button mat-flat-button color="primary" type="submit" [disabled]="memberForm.invalid || isSaving()">
                  @if (isSaving()) {
                    <mat-spinner diameter="20"></mat-spinner>
                  } @else {
                    {{ editingMember() ? 'Update' : 'Create' }}
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      }
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

    .filters-card {
      margin-bottom: 16px;
      padding: 16px;
    }

    .filters-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 250px;
    }

    .filter-buttons {
      display: flex;
      gap: 8px;
    }

    .filter-buttons button.active {
      background: var(--app-primary);
      color: white;
    }

    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .members-table {
      width: 100%;
    }

    .member-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--app-primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .status-chip {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-chip.active {
      background: rgba(76, 175, 80, 0.15);
      color: #2e7d32;
    }

    .status-chip.inactive {
      background: rgba(158, 158, 158, 0.15);
      color: #616161;
    }

    .loading-container,
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      text-align: center;
    }

    .empty-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: var(--app-primary);
      opacity: 0.5;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      margin: 0 0 8px;
    }

    .empty-state p {
      margin: 0 0 16px;
      color: var(--app-text-secondary);
    }

    .delete-action {
      color: #f44336;
    }

    /* Dialog Styles */
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-content {
      background: var(--app-surface);
      border-radius: 12px;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--app-border);
    }

    .dialog-header h2 {
      margin: 0;
      font-size: 20px;
    }

    .dialog-body {
      padding: 24px;
      overflow-y: auto;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 16px 24px;
      border-top: 1px solid var(--app-border);
    }

    .full-width {
      width: 100%;
      margin-bottom: 8px;
    }

    mat-paginator {
      border-top: 1px solid var(--app-border);
    }

    th.mat-header-cell {
      font-weight: 600;
      color: var(--app-text-secondary);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-field {
        min-width: 100%;
      }
    }
  `]
})
export class MembersListComponent implements OnInit {
  private membersService = inject(MembersService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  // State
  members = signal<Member[]>([]);
  totalCount = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);
  searchTerm = signal('');
  activeFilter = signal<'all' | 'active' | 'inactive'>('all');
  isLoading = signal(false);
  isSaving = signal(false);
  showDialog = signal(false);
  editingMember = signal<Member | null>(null);

  displayedColumns = ['fullName', 'email', 'phoneNumber', 'joinedOn', 'isActive', 'actions'];

  private searchSubject = new Subject<string>();

  memberForm: FormGroup = this.fb.group({
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: [''],
    dateOfBirth: [''],
    notes: ['']
  });

  ngOnInit(): void {
    this.loadMembers();

    // Debounce search
    this.searchSubject.pipe(debounceTime(300)).subscribe(term => {
      this.searchTerm.set(term);
      this.pageNumber.set(1);
      this.loadMembers();
    });
  }

  loadMembers(): void {
    this.isLoading.set(true);

    const params: any = {
      pageNumber: this.pageNumber(),
      pageSize: this.pageSize()
    };

    if (this.searchTerm()) {
      params.searchTerm = this.searchTerm();
    }

    if (this.activeFilter() !== 'all') {
      params.isActive = this.activeFilter() === 'active';
    }

    this.membersService.getMembers(params).subscribe({
      next: (response: PaginatedResponse<Member>) => {
        this.members.set(response.items);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading members:', error);
        this.snackBar.open('Failed to load members', 'Close', { duration: 3000 });
        this.isLoading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchSubject.next(value);
  }

  setFilter(filter: 'all' | 'active' | 'inactive'): void {
    this.activeFilter.set(filter);
    this.pageNumber.set(1);
    this.loadMembers();
  }

  onPageChange(event: PageEvent): void {
    this.pageNumber.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadMembers();
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  openMemberDialog(member?: Member): void {
    this.editingMember.set(member || null);
    if (member) {
      this.memberForm.patchValue({
        fullName: member.fullName,
        email: member.email,
        phoneNumber: member.phoneNumber || '',
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '',
        notes: member.notes || ''
      });
    } else {
      this.memberForm.reset();
    }
    this.showDialog.set(true);
  }

  closeDialog(): void {
    this.showDialog.set(false);
    this.editingMember.set(null);
    this.memberForm.reset();
  }

  saveMember(): void {
    if (this.memberForm.invalid) return;

    this.isSaving.set(true);
    const formValue = this.memberForm.value;

    const memberData = {
      fullName: formValue.fullName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber || undefined,
      dateOfBirth: formValue.dateOfBirth || undefined,
      notes: formValue.notes || undefined
    };

    const editing = this.editingMember();

    if (editing) {
      // Update existing member
      this.membersService.updateMember(editing.id, { ...memberData, isActive: editing.isActive }).subscribe({
        next: () => {
          this.snackBar.open('Member updated successfully', 'Close', { duration: 3000 });
          this.closeDialog();
          this.loadMembers();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error updating member:', error);
          this.snackBar.open('Failed to update member', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    } else {
      // Create new member
      this.membersService.createMember(memberData).subscribe({
        next: () => {
          this.snackBar.open('Member created successfully', 'Close', { duration: 3000 });
          this.closeDialog();
          this.loadMembers();
          this.isSaving.set(false);
        },
        error: (error) => {
          console.error('Error creating member:', error);
          this.snackBar.open('Failed to create member', 'Close', { duration: 3000 });
          this.isSaving.set(false);
        }
      });
    }
  }

  toggleMemberStatus(member: Member): void {
    const newStatus = !member.isActive;
    this.membersService.updateMember(member.id, {
      fullName: member.fullName,
      email: member.email,
      phoneNumber: member.phoneNumber,
      dateOfBirth: member.dateOfBirth,
      notes: member.notes,
      isActive: newStatus
    }).subscribe({
      next: () => {
        this.snackBar.open(`Member ${newStatus ? 'activated' : 'deactivated'}`, 'Close', { duration: 3000 });
        this.loadMembers();
      },
      error: (error) => {
        console.error('Error updating member status:', error);
        this.snackBar.open('Failed to update member status', 'Close', { duration: 3000 });
      }
    });
  }

  deleteMember(member: Member): void {
    if (confirm(`Are you sure you want to delete ${member.fullName}?`)) {
      this.membersService.deleteMember(member.id).subscribe({
        next: () => {
          this.snackBar.open('Member deleted successfully', 'Close', { duration: 3000 });
          this.loadMembers();
        },
        error: (error) => {
          console.error('Error deleting member:', error);
          this.snackBar.open('Failed to delete member', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
