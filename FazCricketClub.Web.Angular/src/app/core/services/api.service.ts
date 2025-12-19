import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse, PagedResult } from '../models/api-response.model';

/**
 * Base API service with common HTTP methods
 * Handles ApiResponse<T> unwrapping
 */
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  /**
   * GET request that unwraps ApiResponse<T>
   */
  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.http.get<ApiResponse<T>>(`${environment.apiUrl}/${endpoint}`, { params })
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'API request failed');
          }
          return response.data as T;
        })
      );
  }

  /**
   * POST request that unwraps ApiResponse<T>
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${environment.apiUrl}/${endpoint}`, body)
      .pipe(
        map(response => {
          if (!response.success) {
            throw new Error(response.message || 'API request failed');
          }
          return response.data as T;
        })
      );
  }

  /**
   * PUT request
   */
  put(endpoint: string, body: any): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/${endpoint}`, body);
  }

  /**
   * DELETE request
   */
  delete(endpoint: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/${endpoint}`);
  }

  /**
   * GET paged results
   */
  getPaged<T>(endpoint: string, page: number = 1, pageSize: number = 20, additionalParams?: any): Observable<PagedResult<T>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    // Add additional query parameters
    if (additionalParams) {
      Object.keys(additionalParams).forEach(key => {
        if (additionalParams[key] !== null && additionalParams[key] !== undefined) {
          params = params.set(key, additionalParams[key].toString());
        }
      });
    }

    return this.get<PagedResult<T>>(endpoint, params);
  }
}
