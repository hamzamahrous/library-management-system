import { Component, inject, OnInit } from '@angular/core';
import { CartItem, CartService } from './cart.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import { BooksService } from '../books/services/books.service';
import { Book } from '../books/book-type';
import { CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CartItemComponent, CurrencyPipe, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private booksService = inject(BooksService);
  cartItems?: CartItem[];
  books: Book[] = [];
  sum: number = 0;

  itemTotals: Map<number, number> = new Map();

  ngOnInit(): void {
    this.loadItemsFromCart();
  }

  loadItemsFromCart() {
    this.cartService.loadCart().subscribe({
      next: () => {
        this.cartService.getCart().subscribe({
          next: (cartData) => {
            this.cartItems = cartData;
            this.loadBooks();
          },
        });
      },

      error: (err) => {
        console.error('Failed to load cart items', err);
      },
    });
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (res) => {
        this.books = res;

        if (this.cartItems?.length) {
          for (let item of this.cartItems) {
            const book = this.books.find((b) => b.book_id === item.book);
            if (book) {
              const total = item.quantity * +book.price;
              this.itemTotals.set(item.book, total);
            }
          }

          this.recalculateSum();
        }
      },
    });
  }

  updatePriceSum(bookId: number, newTotal: number) {
    this.itemTotals.set(bookId, newTotal);
    this.recalculateSum();
  }

  recalculateSum() {
    this.sum = 0;
    for (let total of this.itemTotals.values()) {
      this.sum += total;
    }

    this.cartService.setNewSumValue(this.sum);
  }

  handleItemDeleted({
    bookId,
    quantity,
  }: {
    bookId: number;
    quantity: number;
  }) {
    const book = this.books.find((b) => b.book_id === bookId);
    if (book) {
      const itemTotal = quantity * +book.price;
      this.itemTotals.delete(bookId); // optional: clean up the map
      this.sum -= itemTotal;
    }

    // Also optionally remove item from cartItems if needed:
    this.cartItems = this.cartItems?.filter((item) => item.book !== bookId);
  }
}
