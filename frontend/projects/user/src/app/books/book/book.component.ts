import { Component, Input } from '@angular/core';
import { Book } from '../book-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
})
export class BookComponent {
  @Input({ required: true }) book!: Book;

  constructor(private router: Router) {}

  loadBookDetails() {
    this.router.navigate(['/details', this.book.book_id]);
  }
}
