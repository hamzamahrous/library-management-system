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
  private booksService = inject(BooksService);
  showFilter = false;
  disableFirstOption = false;
  books: Book[] = [];
  filterBooks: Book[] = [];
  filteredCategoriesIds: boolean[] = [true, true, true, true, true];
  maxPrice = 50;
  minRating = 1;

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks() {
    this.booksService.getAllBooks().subscribe({
      next: (Data) => {
        this.books = Data;
        this.filterBooks = Data;
        console.log(Data);
      },
    });
  }

  sortTheBooks(event: any) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'low_to_high') {
      this.filterBooks.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (selectedValue === 'high_to_low') {
      this.filterBooks.sort((a, b) => Number(b.price) - Number(a.price));
    }

    this.disableFirstOption = true;
  }

  showFilterBar() {
    this.showFilter = true;
  }

  updateMaxPrice(updatedMaxPrice: number) {
    this.maxPrice = updatedMaxPrice;
    this.applyFilters();
  }

  updateMinRating(updatedMinRating: number) {
    this.minRating = updatedMinRating;
    this.applyFilters();
  }

  onCategorySelectionChanged(selectedCategories: boolean[]) {
    const anyChecked = selectedCategories.some((val) => val);

    if (anyChecked) {
      this.filteredCategoriesIds = selectedCategories;
    } else {
      this.filteredCategoriesIds = [true, true, true, true, true];
    }

    this.applyFilters();
  }

  applyFilters() {
    this.filterBooks = this.books.filter((book) => {
      const matchesCategory = this.filteredCategoriesIds[book.category_id - 1]
        ? true
        : false;

      const matchesPrice = +book.price <= this.maxPrice;
      const matchesRating = book.evaluation >= this.minRating;

      if (matchesCategory && matchesPrice && matchesRating) return true;
      else return false;
    });
  }

  resetFilter() {
    this.filterBooks = this.books;
  }
}
