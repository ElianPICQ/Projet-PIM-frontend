import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

interface LoginResponseSuccess {
  success: boolean,
  message: string,
  user: {
    username: string
  },
  access: string,
  refresh: string
}

interface LoginResponseError {
  success: boolean,
  message: string
}

type LoginResponse = LoginResponseSuccess | LoginResponseError

interface RefreshResponse {
  access: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly loginUrl = environment.API_URL + 'authentication/login/';
  private readonly refreshUrl = environment.API_URL + 'api/token/refresh/';
  private readonly accessKey = 'access';
  private readonly refreshKey = 'refresh';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password });
  }

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.accessKey, access);
    localStorage.setItem(this.refreshKey, refresh);
  }

  clearTokens(): void {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshKey);
  }

  hasRefreshToken(): boolean {
    return !!this.getRefreshToken();
  }

  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return false;
    }

    return !this.isTokenExpired(accessToken);
  }

  refreshAccessToken(): Observable<string> {
    const refresh = this.getRefreshToken();

    if (!refresh) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<RefreshResponse>(this.refreshUrl, { refresh })
      .pipe(
        map((response) => {
          this.setTokens(response.access, refresh);
          return response.access;
        })
      );
  }

  isAuthEndpoint(url: string): boolean {
    return url.includes('/authentication/login/') || url.includes('/api/token/refresh/');
  }

  private isTokenExpired(token: string): boolean {
    const payload = this.decodeJwtPayload(token);
    const exp = payload?.['exp'];

    if (typeof exp !== 'number') {
      return true;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    return exp <= nowInSeconds;
  }

  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      return null;
    }

    try {
      const normalized = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = atob(normalized);
      return JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }
}
