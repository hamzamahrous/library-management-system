import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { AllBooksComponent } from './books/all-books/all-books.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CartComponent } from './cart/cart.component';
import { WhishListComponent } from './whish-list/whish-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
      },
      {
        path: 'cart',
        component: CartComponent,
      },
      {
        path: 'whish-list',
        component: WhishListComponent,
      },
      {
        path: 'books',
        component: AllBooksComponent,
      },
      {
        path: 'details/:bookId',
        component: BookDetailsComponent,
      },
    ],
  },
  {
    path: 'sign-in',
    component: SignInComponent,
  },
  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];
