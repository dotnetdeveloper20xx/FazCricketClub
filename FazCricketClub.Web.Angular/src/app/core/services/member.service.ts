import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Member } from '../models/cricket.model';
import { PagedResult } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly endpoint = 'members';

  constructor(private apiService: ApiService) {}

  /**
   * Get all members (paged)
   */
  getPaged(page: number = 1, pageSize: number = 20, search?: string): Observable<PagedResult<Member>> {
    const params = search ? { search } : undefined;
    return this.apiService.getPaged<Member>(this.endpoint, page, pageSize, params);
  }

  /**
   * Get member by ID
   */
  getById(id: number): Observable<Member> {
    return this.apiService.get<Member>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new member
   */
  create(member: Partial<Member>): Observable<Member> {
    return this.apiService.post<Member>(this.endpoint, member);
  }

  /**
   * Update member
   */
  update(id: number, member: Partial<Member>): Observable<void> {
    return this.apiService.put(`${this.endpoint}/${id}`, member);
  }

  /**
   * Delete member
   */
  delete(id: number): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
