import { Component, inject, OnInit } from '@angular/core';
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
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoggedIn: boolean = false;

  navigateToUserProfile() {
    this.router.navigate(['user-profile']);
  }

  navigateToHomePage() {
    this.router.navigate(['/']);
  }

  navigateToCart() {
    this.router.navigate(['cart']);
  }
  navigateToWhishList() {
    this.router.navigate(['whish-list']);
  }

  navigateToSignIn() {
    this.router.navigate(['sign-in']);
  }

  onSearch(query: string) {
    console.log(query);
  }

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        this.isLoggedIn = status;
      },
    });
  }
}
