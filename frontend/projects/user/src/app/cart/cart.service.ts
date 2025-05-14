import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

export interface CartItem {
  id: number;
  book_id: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private cart$ = new BehaviorSubject<CartItem[]>([]);

  getCart() {
    return this.cart$.asObservable();
  }

  loadCart() {
    this.http
      .get<CartItem[]>('api/transactions')
      .pipe(tap((items) => this.cart$.next(items)));
  }

  addToCart(bookId: number, quantity: number = 1) {
    return this.http
      .post<CartItem>('api/transactions', { book_id: bookId, quantity })
      .pipe(
        tap((addedItem) => {
          const currentCart = this.cart$.value;
          this.cart$.next([...currentCart, addedItem]);
        })
      );
  }

  removeFromCart(cartItemId: number) {
    return this.http.delete(`api/transaction/${cartItemId}`).pipe(
      tap(() => {
        const updatedCart = this.cart$.value.filter(
          (item) => item.id !== cartItemId
        );

        this.cart$.next(updatedCart);
      })
    );
  }

  clearCart() {
    return this.http.delete(`api/clear`).pipe(tap(() => this.cart$.next([])));
  }
}
