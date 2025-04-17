import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output() search = new EventEmitter<string>();

  onSearch() {
    this.search.emit(this.searchControl.value ?? undefined);
  }
}
