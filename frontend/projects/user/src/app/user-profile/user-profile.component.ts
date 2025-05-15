import { Component, inject } from '@angular/core';
import { User } from './user-type';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  user: User = {
    user_id: 1,
    first_name: 'Hamza',
    last_name: 'Mahrous',
    username: 'Hamza_Mahrous',
    email: 'hamza.mahrous11@gmail.com',
    orders: [],
  };

  private authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
