import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../user-profile/user-type';
import { Order } from '../order/order-type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  user: User = this.loadUserFromStorage() || {
    id: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  };
  orders: Order[] = this.loadOrdersFromStorage() || [];
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
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('orders', JSON.stringify(res.orders));
          this.user = res.user;
          this.orders = res.orders;

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
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.router.navigate(['/sign-in']);
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserData(): User {
    return this.user;
  }

  getUserOrders(): Order[] {
    return this.orders;
  }

  private loadUserFromStorage(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  private loadOrdersFromStorage(): Order[] | null {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : null;
  }
}
