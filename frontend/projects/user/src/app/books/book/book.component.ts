import { Component, inject, Input, OnInit } from '@angular/core';
import { Book } from '../book-type';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { CartService } from '../../cart/cart.service';

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
  isLoggedIn: boolean = false;
  @Input({ required: true }) book!: Book;
  @Input({ required: true }) displayInHomePage!: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        this.isLoggedIn = status;
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
      // Some Logic
    } else {
      this.router.navigate(['sign-in']);
    }
  }
}
