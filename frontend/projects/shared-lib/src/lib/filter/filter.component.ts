import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { Category } from 'projects/user/src/app/books/categories-type';
import { BooksService } from 'projects/user/src/app/books/services/books.service';

@Component({
  selector: 'lib-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() categorySelectionChanged = new EventEmitter<boolean[]>();
  @Output() priceRangeChanged = new EventEmitter<number>();
  @Output() ratingSelectionChanged = new EventEmitter<number>();
  @Output() resetFilter = new EventEmitter<void>();

  private booksService = inject(BooksService);
  categories: Category[] = [];

  filterForm = new FormGroup({
    categoryFormArray: new FormArray([
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
      new FormControl(false),
    ]),

    priceControl: new FormControl(Number(50)),

    ratingControl: new FormControl(null),
  });

  constructor() {
    this.filterForm
      .get('categoryFormArray')
      ?.valueChanges.subscribe((selectedCategories) => {
        this.categorySelectionChanged.emit(
          selectedCategories.map((val) => !!val)
        );
      });

    this.filterForm.get('priceControl')?.valueChanges.subscribe((maxPrice) => {
      this.priceRangeChanged.emit(Number(maxPrice));
    });

    this.filterForm
      .get('ratingControl')
      ?.valueChanges.subscribe((newRating) => {
        this.ratingSelectionChanged.emit(Number(newRating));
      });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  onCloseClick() {
    this.close.emit();
  }

  loadCategories() {
    this.booksService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
    });
  }

  resetForm() {
    this.filterForm.reset();

    this.resetFilter.emit();
  }
}
