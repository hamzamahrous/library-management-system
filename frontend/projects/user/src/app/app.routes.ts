import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CartComponent } from './cart/cart.component';
import { WishListComponent } from './wish-list/wish-list.component';
import { AuthGuard } from './guards/auth.guard';

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
        canActivate: [AuthGuard],
      },
      {
        path: 'cart',
        component: CartComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'whish-list',
        component: WishListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'books',
        loadComponent: () => {
          return import('./books/all-books/all-books.component').then(
            (mod) => mod.AllBooksComponent
          );
        },
      },
      {
        path: 'details/:bookId',
        component: BookDetailsComponent,
      },
    ],
  },
  {
    path: 'sign-in',
    loadComponent: () => {
      return import('./auth/sign-in/sign-in.component').then(
        (mod) => mod.SignInComponent
      );
    },
  },
  {
    path: 'sign-up',
    loadComponent: () => {
      return import('./auth/sign-up/sign-up.component').then(
        (mod) => mod.SignUpComponent
      );
    },
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
];
