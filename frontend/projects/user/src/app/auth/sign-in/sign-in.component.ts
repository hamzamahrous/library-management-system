import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LogoComponent } from 'projects/shared-lib/src/lib/logo/logo.component';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, LogoComponent, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  errorMessage = '';
  private authService = inject(AuthService);
  router = inject(Router);
  form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      validators: [Validators.minLength(8), Validators.required],
    }),
  });

  get emailIsInvalid() {
    return (
      this.form.controls.email.touched &&
      this.form.controls.email.dirty &&
      this.form.controls.email.invalid
    );
  }

  get passIsInvalid() {
    return (
      this.form.controls.password.touched &&
      this.form.controls.password.dirty &&
      this.form.controls.password.invalid
    );
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    } else {
      const credentials = {
        email: this.form.value.email || '',
        password: this.form.value.password || '',
      };

      this.authService.login(credentials).subscribe({
        next: (res) => {
          this.errorMessage = '';
          this.router.navigate(['/']);
        },

        error: (err) => {
          console.log(err.error);

          if (err.status === 0) {
            this.errorMessage = 'Unable to connect to the server.';
          } else if (err.status === 401) {
            this.errorMessage = 'Invalid email or password.';
          } else if (err.status === 500) {
            this.errorMessage = 'A server error occurred.';
          } else if (err.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'An unknown error occurred.';
          }
        },
      });
    }
  }
}
