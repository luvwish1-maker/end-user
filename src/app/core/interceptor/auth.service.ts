import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environment/environment';

interface LoginResponse {
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'access_token';
  private readonly userKey = 'user';
  private baseUrl = `${environment.apiUrl}/auth`

  private loggedIn$ = new BehaviorSubject<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.data.access_token) {
          localStorage.setItem(this.tokenKey, response.data.access_token);
          localStorage.setItem(this.userKey, JSON.stringify(response.data.user));
          this.loggedIn$.next(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.loggedIn$.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any | null {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }

  isLoggedIn$(): Observable<boolean> {
    return this.loggedIn$.asObservable();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }

  signup(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}
