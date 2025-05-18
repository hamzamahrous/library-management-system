import { Component, inject, OnInit } from '@angular/core';
import { User } from './user-type';
import { AuthService } from '../auth/auth.service';
import { Order } from '../order/order-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  editFirstName = false;
  editLastName = false;
  editUsername = false;
  editEmail = false;
  emailErrorMessage = '';
  usernameErrorMessage = '';

  orders: Order[] = [];

  private authService = inject(AuthService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        if (status) {
          this.user = this.authService.getUserData();
          this.orders = this.authService.getUserOrders();
        }
      },
    });
  }

  logout() {
    this.authService.logout();
  }

  saveFirstName() {
    this.http
      .patch(`api/userdetail/${this.user.id}/`, {
        first_name: this.user.first_name,
      })
      .subscribe({
        next: (res) => {
          const oldData = localStorage.getItem('user');
          if (oldData) {
            const parsedData = JSON.parse(oldData);
            parsedData.first_name = this.user.first_name;
            localStorage.setItem('user', JSON.stringify(parsedData));
          }

          this.editFirstName = false;
        },

        error: (err) => {
          // error
        },
      });
  }

  saveLastName() {
    this.http
      .patch(`api/userdetail/${this.user.id}/`, {
        last_name: this.user.last_name,
      })
      .subscribe({
        next: (res) => {
          const oldData = localStorage.getItem('user');
          if (oldData) {
            const parsedData = JSON.parse(oldData);
            parsedData.last_name = this.user.last_name;
            localStorage.setItem('user', JSON.stringify(parsedData));
          }

          this.editLastName = false;
        },

        error: (err) => {
          // error
        },
      });
  }

  saveUsername() {
    this.http
      .patch(`api/userdetail/${this.user.id}/`, {
        username: this.user.username,
      })
      .subscribe({
        next: (res) => {
          this.usernameErrorMessage = '';
          const oldData = localStorage.getItem('user');
          if (oldData) {
            const parsedData = JSON.parse(oldData);
            parsedData.username = this.user.username;
            localStorage.setItem('user', JSON.stringify(parsedData));
          }

          this.editUsername = false;
        },

        error: (err) => {
          this.usernameErrorMessage = '';
          console.error(err.error);

          if (err.status === 0) {
            this.usernameErrorMessage = 'Unable to connect to the server.';
          } else if (err.status === 500) {
            this.usernameErrorMessage = 'A server error occurred.';
          } else if (
            err.error?.username?.includes(
              'A user with that username already exists.'
            )
          ) {
            this.usernameErrorMessage = "This username isn't available";
          } else if (err.error?.message) {
            this.usernameErrorMessage = err.error.message;
          } else if (this.user.username == '') {
            this.usernameErrorMessage = "This username can't be empty";
          } else {
            this.usernameErrorMessage = 'An unknown error occurred.';
          }
        },
      });
  }

  saveEmail() {
    this.http
      .patch(`api/userdetail/${this.user.id}/`, {
        email: this.user.email,
      })
      .subscribe({
        next: (res) => {
          this.emailErrorMessage = '';
          const oldData = localStorage.getItem('user');
          if (oldData) {
            const parsedData = JSON.parse(oldData);
            parsedData.email = this.user.email;
            localStorage.setItem('user', JSON.stringify(parsedData));
          }

          this.editEmail = false;
        },

        error: (err) => {
          this.emailErrorMessage = '';
          console.error(err.error);

          if (err.status === 0) {
            this.emailErrorMessage = 'Unable to connect to the server.';
          } else if (err.status === 500) {
            this.emailErrorMessage = 'A server error occurred.';
          } else if (
            err.error?.email?.includes('user with this email already exists.')
          ) {
            this.emailErrorMessage = 'A user with this email already exists.';
          } else if (err.error?.message) {
            this.emailErrorMessage = err.error.message;
          } else if (this.user.email == '') {
            this.emailErrorMessage = "This email can't be empty";
          } else {
            this.emailErrorMessage = 'An unknown error occurred.';
          }

          console.log(this.emailErrorMessage);
        },
      });
  }

  cancelEditFirstName() {
    this.editFirstName = false;

    const oldData = localStorage.getItem('user');
    if (oldData) {
      const parsedData = JSON.parse(oldData);
      this.user.first_name = parsedData.first_name;
    }
  }

  cancelEditLastName() {
    this.editLastName = false;

    const oldData = localStorage.getItem('user');
    if (oldData) {
      const parsedData = JSON.parse(oldData);
      this.user.last_name = parsedData.last_name;
    }
  }

  cancelEditUsername() {
    this.editUsername = false;
    this.usernameErrorMessage = '';

    const oldData = localStorage.getItem('user');
    if (oldData) {
      const parsedData = JSON.parse(oldData);
      this.user.username = parsedData.username;
    }
  }

  cancelEditEmail() {
    this.editEmail = false;
    this.emailErrorMessage = '';

    const oldData = localStorage.getItem('user');
    if (oldData) {
      const parsedData = JSON.parse(oldData);
      this.user.email = parsedData.email;
    }
  }
}
