import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../book-type';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor() {}
  private httpClient = inject(HttpClient);

  // Get All Categories

  // Get Trending Books
  getTrendingBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>('api/trending-books');
  }

  getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>('api/books');
  }

  getBookDetails(bookId: number): Observable<Book> {
    return this.httpClient.get<Book>('api/books/' + bookId);
  }
}
