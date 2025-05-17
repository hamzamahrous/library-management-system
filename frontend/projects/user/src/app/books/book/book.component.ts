import { Component, inject, Input, OnInit } from '@angular/core';
import { Book } from '../book-type';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CartItem, CartService } from '../../cart/cart.service';
import { WishListServiceService } from '../../wish-list/wish-list-service.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private WishListService = inject(WishListServiceService);
  isLoggedIn: boolean = false;
  isInCart: boolean = false;
  isInWishList: boolean = false;

  @Input({ required: true }) book!: Book;
  @Input({ required: true }) displayInHomePage!: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        this.isLoggedIn = status;

        if (this.isLoggedIn) {
          this.cartService.isInCart(this.book.book_id).subscribe((res) => {
            this.isInCart = res;
          });

          this.WishListService.isInWishList(this.book.book_id).subscribe(
            (res) => {
              this.isInWishList = res;
            }
          );
        }
      },
    });
  }

  loadBookDetails() {
    this.router.navigate(['/details', this.book.book_id]);
  }

  addToCart() {
    if (this.isLoggedIn) {
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
    if (this.isLoggedIn) {
      this.WishListService.addToWishList(this.book.book_id).subscribe({
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
