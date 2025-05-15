import { Component, inject, OnInit } from '@angular/core';
import { SearchBarComponent } from 'projects/shared-lib/src/lib/search-bar/search-bar.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BooksService } from '../books/services/books.service';
import { Book } from '../books/book-type';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent, CurrencyPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private booksService = inject(BooksService);
  private router = inject(Router);
  isLoggedIn: boolean = false;
  books: Book[] = [];
  searchedBooks: Book[] = [];
  activeSearchContext: 'desktop' | 'mobile' | null = null;
  clearSearchBarValue = false;

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        this.isLoggedIn = status;
      },
    });

    this.booksService.getAllBooks().subscribe({
      next: (data) => {
        this.books = data;
      },
    });
  }

  navigateToUserProfile() {
    this.router.navigate(['user-profile']);
  }

  navigateToHomePage() {
    this.router.navigate(['/']);
  }

  navigateToCart() {
    this.router.navigate(['cart']);
  }

  navigateToWhishList() {
    this.router.navigate(['whish-list']);
  }

  navigateToSignIn() {
    this.router.navigate(['sign-in']);
  }

  navigateToBookDetails(bookId: number) {
    this.activeSearchContext = null;
    this.searchedBooks = [];
    this.clearSearchBarValue = true;
    this.router.navigate(['/details', bookId]);
  }

  onSearch(query: string, context: 'desktop' | 'mobile') {
    this.clearSearchBarValue = false;
    this.activeSearchContext = context;
    const lowerQuery = query.toLowerCase().trim();

    if (!lowerQuery) {
      this.searchedBooks = [];
      this.activeSearchContext = null;
      return;
    }

    this.searchedBooks = this.books.filter(
      (book) =>
        book.book_name.toLowerCase().includes(lowerQuery) ||
        book.author_name.toLowerCase().includes(lowerQuery)
    );
  }
}
