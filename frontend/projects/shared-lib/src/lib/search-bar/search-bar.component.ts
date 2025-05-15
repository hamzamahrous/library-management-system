import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';

@Component({
  selector: 'lib-search-bar',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  @Input() clearSearchValue!: boolean;
  @Output() search = new EventEmitter<string>();

  debounceTimer: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['clearSearchValue']) {
      this.clearValue();
    }
  }

  clearValue() {
    this.searchControl.setValue('');
  }

  onSearchChange() {
    clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.onSearch();
    }, 500);
  }

  onSearch() {
    this.search.emit(this.searchControl.value ?? undefined);
  }
}
