import { Component, inject, OnInit } from '@angular/core';
import { User } from './user-type';
import { AuthService } from '../auth/auth.service';
import { Order } from '../order/order-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { BooksService } from '../books/services/books.service';
import { Book } from '../books/book-type';
import { BookComponent } from '../books/book/book.component';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, BookComponent],
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
  aiParagraph: string = '';
  aiSuggestedBooksIds: number[] = [];
  aiSuggestedBooks: Book[] = [];
  isLoadingAiData: boolean = true;

  orders: Order[] = [];

  private authService = inject(AuthService);
  private booksService = inject(BooksService);
  private http = inject(HttpClient);

  ngOnInit(): void {
    console.log(`${environment.apiUrl}`);
    this.authService.isLoggedIn$.subscribe({
      next: (status) => {
        if (status) {
          this.user = this.authService.getUserData();

          this.http.get<Order[]>(`${environment.apiUrl}/orders`).subscribe({
            next: (res) => {
              this.orders = res;
            },
          });
        }
      },
    });

    this.http
      .get<{ paragraph: string; suggested_books: number[] }>(
        `${environment.apiUrl}/ai-model/`
      )
      .subscribe({
        next: (res) => {
          this.aiParagraph = res.paragraph;
          this.aiSuggestedBooksIds = res.suggested_books;

          for (let i = 0; i < this.aiSuggestedBooksIds.length; i++) {
            this.booksService
              .getBookDetails(this.aiSuggestedBooksIds[i])
              .subscribe({
                next: (res) => {
                  this.aiSuggestedBooks.push(res);
                },
              });
          }

          this.isLoadingAiData = false;
        },

        error: (err) => {
          this.isLoadingAiData = false;
        },
      });
  }

  logout() {
    this.authService.logout();
  }

  saveFirstName() {
    this.http
      .patch(`${environment.apiUrl}/userdetail/${this.user.id}/`, {
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
      .patch(`${environment.apiUrl}/userdetail/${this.user.id}/`, {
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
          this.aiParagraph = 'An error occurred, Please try again later';
        },
      });
  }

  saveUsername() {
    this.http
      .patch(`${environment.apiUrl}/userdetail/${this.user.id}/`, {
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
      .patch(`${environment.apiUrl}/userdetail/${this.user.id}/`, {
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
