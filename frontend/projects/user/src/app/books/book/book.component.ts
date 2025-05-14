import { Component, inject, Input, OnInit } from '@angular/core';
import { Book } from '../book-type';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent implements OnInit {
  private authService = inject(AuthService);
  isLoggedIn: boolean = false;
  @Input({ required: true }) book!: Book;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        this.isLoggedIn = status;
      },
    });
  }

  loadBookDetails() {
    this.router.navigate(['/details', this.book.book_id]);
  }

  addToCart(book: Book) {}

  addToWishlist(book: Book) {}
}
