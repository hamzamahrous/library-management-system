import { Component, inject } from '@angular/core';
import { SearchBarComponent } from 'projects/shared-lib/src/lib/search-bar/search-bar.component';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn = this.authService.isLoggedIn$;

  navigateToUserProfile() {
    this.router.navigate(['user-profile']);
  }

  navigateToHomePage() {
    this.router.navigate(['/']);
  }

  navigateCart() {
    this.router.navigate(['cart']);
  }
  navigateToWhishList() {
    this.router.navigate(['whish-list']);
  }

  onSearch(query: string) {
    console.log(query);
  }
}
