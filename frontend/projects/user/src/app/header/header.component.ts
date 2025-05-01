import { Component } from '@angular/core';
import { SearchBarComponent } from 'projects/shared-lib/src/lib/search-bar/search-bar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  onSearch(query: string) {
    console.log(query);
  }
}
