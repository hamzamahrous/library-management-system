import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return new Observable((observer) => {
      this.http.post('api/login/', credentials).subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token);
          this.loggedIn.next(true);
          observer.next(res);
          observer.complete();
        },

        error: (err) => {
          observer.error(err);
        },
      });
    });
  }

  signup(credentials: { username: string; email: string; password: string }) {
    return this.http.post('api/register/', credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/sign-in']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
