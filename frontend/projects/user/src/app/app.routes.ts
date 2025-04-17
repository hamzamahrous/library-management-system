import { Routes } from '@angular/router';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { DefaultHomeComponent } from './home/default-home/default-home.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DefaultHomeComponent,
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
];
