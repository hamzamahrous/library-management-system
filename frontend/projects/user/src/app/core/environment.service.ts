import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  get apiUrl(): string {
    // Ensure the API URL doesn't have trailing slash issues
    return environment.apiUrl.replace(/\/$/, '');
  }

  get isProduction(): boolean {
    return environment.production;
  }

  /**
   * Get the full API endpoint URL
   * @param endpoint - The endpoint path (should start with /)
   * @returns Full URL for the API endpoint
   */
  getApiUrl(endpoint: string): string {
    // Ensure endpoint starts with /
    if (!endpoint.startsWith('/')) {
      endpoint = '/' + endpoint;
    }

    return `${this.apiUrl}${endpoint}`;
  }
}
