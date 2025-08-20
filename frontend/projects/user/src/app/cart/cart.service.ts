import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  transaction_id: number;
  book: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private cart$ = new BehaviorSubject<CartItem[]>([]);
  private sum$ = new BehaviorSubject<number>(0);

  getCart() {
    return this.cart$.asObservable();
  }

  getSum() {
    return this.sum$.asObservable();
  }

  setNewSumValue(newTotal: number) {
    this.sum$.next(newTotal);
  }

  loadCart() {
    return this.http.get<CartItem[]>(`${environment.apiUrl}/transactions`).pipe(
      tap((items) => {
        this.cart$.next(items);
      })
    );
  }

  addToCart(bookId: number, quantity: number = 1) {
    return this.http
      .post<CartItem>(`${environment.apiUrl}/transactions/`, {
        book: bookId,
        quantity,
      })
      .pipe(
        tap((addedItem) => {
          const currentCart = this.cart$.value;
          this.cart$.next([...currentCart, addedItem]);
        })
      );
  }

  increaseQuantity(bookId: number, cartItemId: number): void {
    const currentItem = this.cart$.value.find(
      (item) => item.transaction_id === cartItemId
    );

    if (currentItem) {
      const newQuantity = currentItem.quantity + 1;

      this.http
        .patch<CartItem>(`${environment.apiUrl}/transactions/${cartItemId}/`, {
          quantity: newQuantity,
        })
        .subscribe((updatedItem) => {
          const updatedCart = this.cart$.value.map((item) =>
            item.transaction_id === cartItemId ? updatedItem : item
          );
          this.cart$.next(updatedCart);
        });
    }
  }

  decreaseQuantity(bookId: number, cartItemId: number): void {
    const currentItem = this.cart$.value.find(
      (item) => item.transaction_id === cartItemId
    );

    if (currentItem && currentItem.quantity > 1) {
      const newQuantity = currentItem.quantity - 1;

      this.http
        .patch<CartItem>(`${environment.apiUrl}/transactions/${cartItemId}/`, {
          quantity: newQuantity,
        })
        .subscribe((updatedItem) => {
          const updatedCart = this.cart$.value.map((item) =>
            item.transaction_id === cartItemId ? updatedItem : item
          );
          this.cart$.next(updatedCart);
        });
    }
  }

  removeFromCart(cartItemId: number) {
    return this.http
      .delete(`${environment.apiUrl}/transactions/${cartItemId}/`)
      .pipe(
        tap(() => {
          const updatedCart = this.cart$.value.filter(
            (item) => item.transaction_id !== cartItemId
          );

          this.cart$.next(updatedCart);
        })
      );
  }

  clearCart() {
    return this.http
      .delete(`${environment.apiUrl}/clear`)
      .pipe(tap(() => this.cart$.next([])));
  }

  isInCart(bookId: number): Observable<boolean> {
    return this.cart$
      .asObservable()
      .pipe(map((items) => items.some((item) => item.book === bookId)));
  }
}
