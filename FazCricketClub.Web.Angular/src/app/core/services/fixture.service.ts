import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Fixture } from '../models/cricket.model';
import { PagedResult } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FixtureService {
  private readonly endpoint = 'fixtures';

  constructor(private apiService: ApiService) {}

  /**
   * Get all fixtures (paged)
   */
  getPaged(page: number = 1, pageSize: number = 20, filters?: {
    seasonId?: number;
    teamId?: number;
    fromDate?: string;
    toDate?: string;
  }): Observable<PagedResult<Fixture>> {
    return this.apiService.getPaged<Fixture>(this.endpoint, page, pageSize, filters);
  }

  /**
   * Get upcoming fixtures
   */
  getUpcoming(days: number = 7, teamId?: number): Observable<Fixture[]> {
    const params = teamId ? { days, teamId } : { days };
    return this.apiService.get<Fixture[]>(`${this.endpoint}/upcoming`, undefined);
  }

  /**
   * Get fixture by ID
   */
  getById(id: number): Observable<Fixture> {
    return this.apiService.get<Fixture>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new fixture
   */
  create(fixture: Partial<Fixture>): Observable<Fixture> {
    return this.apiService.post<Fixture>(this.endpoint, fixture);
  }

  /**
   * Update fixture
   */
  update(id: number, fixture: Partial<Fixture>): Observable<void> {
    return this.apiService.put(`${this.endpoint}/${id}`, fixture);
  }

  /**
   * Delete fixture
   */
  delete(id: number): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
