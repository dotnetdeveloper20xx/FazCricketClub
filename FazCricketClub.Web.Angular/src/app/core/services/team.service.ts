import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Team } from '../models/cricket.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly endpoint = 'teams';

  constructor(private apiService: ApiService) {}

  getAll(): Observable<Team[]> {
    return this.apiService.get<Team[]>(this.endpoint);
  }

  getById(id: number): Observable<Team> {
    return this.apiService.get<Team>(`${this.endpoint}/${id}`);
  }

  create(team: Partial<Team>): Observable<Team> {
    return this.apiService.post<Team>(this.endpoint, team);
  }

  update(id: number, team: Partial<Team>): Observable<void> {
    return this.apiService.put(`${this.endpoint}/${id}`, team);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
