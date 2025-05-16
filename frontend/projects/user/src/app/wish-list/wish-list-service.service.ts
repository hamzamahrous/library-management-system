import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

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
    return this.http.get<WishList[]>('api/wishlist').pipe(
      tap((items) => {
        this.wishList$.next(items);
      })
    );
  }

  addToWishList(bookId: number, quantity: number = 1) {
    return this.http
      .post<WishList>('api/wishlist/', { book: bookId, quantity, order: 1 })
      .pipe(
        tap((addedItem) => {
          const currentWishList = this.wishList$.value;
          this.wishList$.next([...currentWishList, addedItem]);
        })
      );
  }

  removeFromWishList(wishListItemId: number) {
    return this.http.delete(`api/wishlist/${wishListItemId}/`).pipe(
      tap(() => {
        const updatedWishList = this.wishList$.value.filter(
          (item) => item.wishlist_id !== wishListItemId
        );

        this.wishList$.next(updatedWishList);
      })
    );
  }
}
