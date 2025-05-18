import {
  Component,
  EventEmitter,
  inject,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Book } from '../../books/book-type';
import { BooksService } from '../../books/services/books.service';
import { CartService } from '../cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent implements OnInit {
  private booksService = inject(BooksService);
  private cartService = inject(CartService);
  @Input({ required: true }) bookId!: number;
  @Input({ required: true }) quantity!: number;
  @Input({ required: true }) itemId!: number;
  @Output() totalPriceChanged = new EventEmitter<number>();
  @Output() itemDeleted = new EventEmitter<{
    bookId: number;
    quantity: number;
  }>();

  book?: Book;

  ngOnInit(): void {
    this.booksService.getBookDetails(this.bookId).subscribe({
      next: (book) => {
        this.book = book;
      },
      error: (err) => {
        console.error('Failed to load the book', err.error);
      },
    });
  }

  decreaseQuantity() {
    if (this.book?.book_id) {
      this.cartService.decreaseQuantity(this.book.book_id, +this.itemId);
      this.totalPriceChanged.emit(this.quantity - 1 * +this.book.price);
    }
  }

  increaseQuantity() {
    if (this.book?.book_id) {
      this.cartService.increaseQuantity(this.book.book_id, +this.itemId);
      this.totalPriceChanged.emit(this.quantity + 1 * +this.book.price);
    }
  }

  deleteItem() {
    this.cartService.removeFromCart(+this.itemId).subscribe({
      next: (res) => {
        if (this.book?.book_id) {
          this.itemDeleted.emit({
            bookId: this.book.book_id,
            quantity: this.quantity,
          });
        }
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
}
