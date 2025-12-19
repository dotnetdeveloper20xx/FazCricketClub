import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Season } from '../models/cricket.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonService {
  private readonly endpoint = 'seasons';

  constructor(private apiService: ApiService) {}

  /**
   * Get all seasons
   */
  getAll(): Observable<Season[]> {
    return this.apiService.get<Season[]>(this.endpoint);
  }

  /**
   * Get season by ID
   */
  getById(id: number): Observable<Season> {
    return this.apiService.get<Season>(`${this.endpoint}/${id}`);
  }

  /**
   * Create new season
   */
  create(season: Partial<Season>): Observable<Season> {
    return this.apiService.post<Season>(this.endpoint, season);
  }

  /**
   * Update season
   */
  update(id: number, season: Partial<Season>): Observable<void> {
    return this.apiService.put(`${this.endpoint}/${id}`, season);
  }

  /**
   * Delete season
   */
  delete(id: number): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
