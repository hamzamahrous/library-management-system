import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WishList {
  wishlist_id: number;
  book: number;
}

@Injectable({
  providedIn: 'root',
})
export class WishListServiceService {
  private http = inject(HttpClient);
  private wishList$ = new BehaviorSubject<WishList[]>([]);

  getWishList() {
    return this.wishList$.asObservable();
  }

  loadWishList() {
    return this.http.get<WishList[]>(`${environment.apiUrl}/wishlist`).pipe(
      tap((items) => {
        this.wishList$.next(items);
      })
    );
  }

  addToWishList(bookId: number, quantity: number = 1) {
    return this.http
      .post<WishList>(`${environment.apiUrl}/wishlist/`, {
        book: bookId,
        quantity,
        order: 1,
      })
      .pipe(
        tap((addedItem) => {
          const currentWishList = this.wishList$.value;
          this.wishList$.next([...currentWishList, addedItem]);
        })
      );
  }

  removeFromWishList(wishListItemId: number) {
    return this.http
      .delete(`${environment.apiUrl}/wishlist/${wishListItemId}/`)
      .pipe(
        tap(() => {
          const updatedWishList = this.wishList$.value.filter(
            (item) => item.wishlist_id !== wishListItemId
          );

          this.wishList$.next(updatedWishList);
        })
      );
  }

  isInWishList(bookId: number): Observable<boolean> {
    return this.wishList$
      .asObservable()
      .pipe(map((items) => items.some((item) => item.book === bookId)));
  }
}
