import { Component, inject, Input, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../cart/cart.service';
import { BooksService } from '../../books/services/books.service';
import { Book } from '../../books/book-type';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private booksService = inject(BooksService);
  cartItems: CartItem[] = [];
  books: Book[] = [];
  sum = 0;

  ngOnInit(): void {
    this.cartService.getCart().subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.books = [];

      this.sum = 0;

      const bookDetails$ = cartItems.map((item) =>
        this.booksService.getBookDetails(item.book)
      );

      forkJoin(bookDetails$).subscribe({
        next: (books) => {
          this.books = books;

          let totalSum = 0;
          for (let i = 0; i < cartItems.length; i++) {
            totalSum += cartItems[i].quantity * +books[i].price;
          }

          this.sum = totalSum;
          this.cartService.setNewSumValue(totalSum);
        },
        error: (err) => console.error(err),
      });
    });

    this.cartService.getSum().subscribe((sum) => {
      this.sum = sum;
    });
  }
}
