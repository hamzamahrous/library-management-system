import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { Book } from '../book-type';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css',
})
export class BookDetailsComponent {
  private httpClient = inject(HttpClient);
  private booksService = inject(BooksService);
  @Input() bookId!: string;
  book: Book | undefined;

  ngOnInit(): void {
    this.booksService.getBookDetails(+this.bookId).subscribe({
      next: (Book) => {
        this.book = Book as Book;
        console.log(this.book);
      },
    });
  }
}
