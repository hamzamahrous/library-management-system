import { Component, inject, Input, OnInit } from '@angular/core';
import { CartItem, CartService } from '../../cart/cart.service';
import { BooksService } from '../../books/services/books.service';
import { Book } from '../../books/book-type';
import { CurrencyPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private cartService = inject(CartService);
  private booksService = inject(BooksService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  cartItems: CartItem[] = [];
  books: Book[] = [];
  sum = 0;
  order_id: number = 0;
  isLoading = false;

  form = new FormGroup({
    phone: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(
          /^\+?(\d{1,3})?[-.\s]?(\(?\d{1,4}\)?)[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
        ),
      ],
    }),
    street: new FormControl('', {
      validators: [Validators.minLength(8), Validators.required],
    }),
    city: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3)],
    }),
    state: new FormControl('', {
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  get phoneIsInvalid() {
    return (
      this.form.controls.phone.touched &&
      this.form.controls.phone.dirty &&
      this.form.controls.phone.invalid
    );
  }

  get streetIsInvalid() {
    return (
      this.form.controls.street.touched &&
      this.form.controls.street.dirty &&
      this.form.controls.street.invalid
    );
  }

  get cityIsInvalid() {
    return (
      this.form.controls.city.touched &&
      this.form.controls.city.dirty &&
      this.form.controls.city.invalid
    );
  }

  get stateIsInvalid() {
    return (
      this.form.controls.state.touched &&
      this.form.controls.state.dirty &&
      this.form.controls.state.invalid
    );
  }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((cartItems) => {
      this.cartItems = cartItems;
      this.books = [];

      this.sum = 0;

      const bookDetails$ = cartItems.map((item) =>
        this.booksService.getBookDetails(item.book)
      );

      forkJoin(bookDetails$).subscribe({
        next: (books) => {
          this.books = books;

          let totalSum = 0;
          for (let i = 0; i < cartItems.length; i++) {
            totalSum += cartItems[i].quantity * +books[i].price;
          }

          this.sum = totalSum;
          this.cartService.setNewSumValue(totalSum);
        },
        error: (err) => console.error(err),
      });
    });

    this.cartService.getSum().subscribe((sum) => {
      this.sum = sum;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      shipping_address: `${this.form.controls.street.value}, ${this.form.controls.city.value}, ${this.form.controls.state.value}`,
    };

    console.log(formData);

    this.httpClient
      .post<{ order_id: number; shipping_address: string }>(
        'api/create-order-from-cart/',
        formData
      )
      .subscribe({
        next: (res) => {
          this.isLoading = true;
          this.httpClient
            .post<{ sessionUrl: string }>(`api/pay/${res.order_id}/`, {})
            .subscribe({
              next: (res) => {
                this.isLoading = false;
                window.location.href = res.sessionUrl;
              },

              error: (err) => {
                this.isLoading = false;
                console.log(err.error);
              },
            });
        },

        error: (err) => {
          console.log(err.error);
        },
      });
  }
}
