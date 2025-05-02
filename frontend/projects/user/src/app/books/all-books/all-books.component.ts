import { Component, inject } from '@angular/core';
import { BooksService } from '../services/books.service';
import { Book } from '../book-type';
import { BookComponent } from '../book/book.component';
import { FilterComponent } from '../../../../../shared-lib/src/lib/filter/filter.component';

@Component({
  selector: 'app-all-books',
  standalone: true,
  imports: [BookComponent, FilterComponent],
  templateUrl: './all-books.component.html',
  styleUrl: './all-books.component.css',
})
export class AllBooksComponent {
  showFilter = false;
  private booksService = inject(BooksService);
  books: Book[] = [];
  disableFirstOption = false;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (Data) => {
        this.books = Data;
      },
    });
  }

  sortTheBooks(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'low_to_high') {
      this.books.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedValue === 'high_to_low') {
      this.books.sort((a, b) => Number(b.price) - Number(a.price));
    }

    this.disableFirstOption = true;
  }

  showFilterBar() {
    this.showFilter = true;
  }
}
