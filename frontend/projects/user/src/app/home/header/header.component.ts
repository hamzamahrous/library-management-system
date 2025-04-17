import { Component } from '@angular/core';
import { SearchBarComponent } from '../../../../../shared-lib/src/lib/search-bar/search-bar.component';
import { LogoComponent } from '../../../../../shared-lib/src/lib/logo/logo.component';

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
