import { Component, inject, OnInit } from '@angular/core';
import { Book } from '../../books/book-type';
import { HttpClient } from '@angular/common/http';
import { BookComponent } from '../../books/book/book.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BooksService } from '../../books/services/books.service';

@Component({
  selector: 'app-default-home',
  standalone: true,
  imports: [BookComponent],
  templateUrl: './default-home.component.html',
  styleUrl: './default-home.component.css',
})
export class DefaultHomeComponent implements OnInit {
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private booksService = inject(BooksService);
  trendingBooks: Book[] = [];

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (Data) => {
        this.trendingBooks = Data;
        this.trendingBooks.push(...this.trendingBooks.slice(0, 2));
      },
    });
  }
}
