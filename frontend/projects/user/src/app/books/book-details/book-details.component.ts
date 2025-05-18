import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { Book } from '../book-type';
import { BooksService } from '../services/books.service';
import { AuthService } from '../../auth/auth.service';
import { WishListServiceService } from '../../wish-list/wish-list-service.service';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  private booksService = inject(BooksService);
  private authService = inject(AuthService);
  private wishListService = inject(WishListServiceService);
  private cartService = inject(CartService);
  @Input() bookId!: string;
  book: Book | undefined;
  isLoggedIn?: boolean;
  isInCart = false;
  isInWishList = false;
  router: any;

  ngOnInit(): void {
    this.booksService.getBookDetails(+this.bookId).subscribe({
      next: (Book) => {
        this.book = Book as Book;

        this.authService.isLoggedIn$.subscribe({
          next: (status) => {
            this.isLoggedIn = status;

            if (this.isLoggedIn && this.book) {
              this.cartService.isInCart(this.book.book_id).subscribe((res) => {
                this.isInCart = res;
              });

              this.wishListService
                .isInWishList(this.book.book_id)
                .subscribe((res) => {
                  this.isInWishList = res;
                });
            }
          },
        });
      },
    });
  }

  addToCart() {
    if (this.isLoggedIn && this.book) {
      this.cartService.addToCart(this.book.book_id, 1).subscribe({
        next: (res) => {
          console.log(res);
        },

        error: (err) => {
          console.log(err.error);
        },
      });
    } else {
      this.router.navigate(['sign-in']);
    }
  }

  addToWishlist() {
    if (this.isLoggedIn && this.book) {
      this.wishListService.addToWishList(this.book.book_id).subscribe({
        next: (res) => {
          console.log(res);
        },

        error: (err) => {
          console.log(err.error);
        },
      });
    } else {
      this.router.navigate(['sign-in']);
    }
  }
}
