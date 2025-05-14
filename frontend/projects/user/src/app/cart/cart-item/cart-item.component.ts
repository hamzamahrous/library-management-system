import { Component, inject, Input, OnInit } from '@angular/core';
import { Book } from '../../books/book-type';
import { BooksService } from '../../books/services/books.service';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent implements OnInit {
  private booksService = inject(BooksService);
  @Input({ required: true }) bookId!: number;
  @Input({ required: true }) quantity!: number;
  books: Book[] = [];
  book: Book = {
    book_id: 0,
    publishing_date: '',
    book_name: '',
    author_name: '',
    publisher: '',
    book_language: '',
    pages_num: 0,
    price: '',
    num_of_sells: 0,
    stock_quantity: 0,
    evaluation: 0,
    brief_abstraction: '',
    long_abstraction: '',
    cover_image: '',
    category_id: 0,
  };

  ngOnInit(): void {
    this.booksService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        const foundBook = this.books.find(
          (item) => item.book_id === this.bookId
        );
        if (foundBook) {
          this.book = foundBook;
        }
      },
    });
  }
}
