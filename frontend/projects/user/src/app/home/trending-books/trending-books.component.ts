import { Component, inject } from '@angular/core';
import { BookComponent } from '../../books/book/book.component';
import { BooksService } from '../../books/services/books.service';
import { Book } from '../../books/book-type';

@Component({
  selector: 'app-trending-books',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './trending-books.component.html',
  styleUrl: './trending-books.component.css',
})
export class TrendingBooksComponent {
  private booksService = inject(BooksService);
  trendingBooks: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (Data) => {
        this.trendingBooks = Data;
        this.trendingBooks = this.trendingBooks.slice(18, 25);
      },
    });
  }
}
