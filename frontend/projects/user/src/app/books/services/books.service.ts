import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../book-type';
import { Category } from '../categories-type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  constructor() {}
  private httpClient = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(`${environment.apiUrl}/category`);
  }

  getTrendingBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${environment.apiUrl}/trending-books`);
  }

  getAllBooks(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${environment.apiUrl}/books`);
  }

  getBookDetails(bookId: number): Observable<Book> {
    return this.httpClient.get<Book>(`${environment.apiUrl}/books/` + bookId);
  }
}
