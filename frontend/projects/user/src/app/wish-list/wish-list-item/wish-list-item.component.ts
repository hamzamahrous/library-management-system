import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Book } from '../../books/book-type';
import { BooksService } from '../../books/services/books.service';
import { WishListServiceService } from '../wish-list-service.service';

@Component({
  selector: 'app-wish-list-item',
  standalone: true,
  imports: [],
  templateUrl: './wish-list-item.component.html',
  styleUrl: './wish-list-item.component.css',
})
export class WishListItemComponent {
  private booksService = inject(BooksService);
  private wishListService = inject(WishListServiceService);
  @Input({ required: true }) bookId!: number;
  @Input({ required: true }) itemId!: number;
  @Output() itemDeleted = new EventEmitter<{
    bookId: number;
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

  deleteItem() {
    this.wishListService.removeFromWishList(+this.itemId).subscribe({
      next: (res) => {
        if (this.book?.book_id) {
          console.log(res);
          this.itemDeleted.emit({
            bookId: this.book.book_id,
          });
        }
      },

      error: (err) => {
        console.log(err);
      },
    });
  }
}
