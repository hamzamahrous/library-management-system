import { Component, inject, OnInit } from '@angular/core';
import { User } from './user-type';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent implements OnInit {
  isLoggedIn: boolean = true;
  user: User = {
    id: 1,
    first_name: 'Hamza',
    last_name: 'Mahrous',
    username: 'Hamza_Mahrous',
    email: 'hamza.mahrous11@gmail.com',
  };

  private authService = inject(AuthService);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        if (status) {
          this.user = this.authService.getUserData();
        }
      },
    });
  }

  logout() {
    this.authService.logout();
  }
}
