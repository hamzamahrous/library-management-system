import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LogoComponent } from '../../../../../shared-lib/src/lib/logo/logo.component';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [LogoComponent, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  errorMessage = '';

  form = new FormGroup(
    {
      firstName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/),
        ],
      }),
      lastName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z]+(?:[\s-][A-Za-z]+)*$/),
        ],
      }),
      userName: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z]+(?:[ _-][A-Za-z]+)*$/),
        ],
      }),
      email: new FormControl('', {
        validators: [Validators.email, Validators.required],
      }),
      password: new FormControl('', {
        validators: [Validators.minLength(8), Validators.required],
      }),
      confirmedPassword: new FormControl('', {
        validators: [Validators.required],
      }),
    },
    { validators: this.passwordMatchValidator }
  );

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

  get nameIsInvalid() {
    return (
      (this.form.controls.firstName.touched &&
        this.form.controls.firstName.dirty &&
        this.form.controls.firstName.invalid) ||
      (this.form.controls.lastName.touched &&
        this.form.controls.lastName.dirty &&
        this.form.controls.lastName.invalid)
    );
  }

  get confirmPasswordIsInvalid() {
    return (
      this.form.controls.confirmedPassword.touched &&
      this.form.hasError('passwordMismatch')
    );
  }

  get usernameIsInvalid() {
    return (
      this.form.controls.userName.touched &&
      this.form.controls.userName.dirty &&
      this.form.controls.userName.invalid
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmedPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = {
      firstName: this.form.get('firstName')?.value || '',
      lastName: this.form.get('lastName')?.value || '',
      username: this.form.get('userName')?.value || '',
      email: this.form.get('email')?.value || '',
      password: this.form.get('password')?.value || '',
    };

    console.log(credentials);
    this.authService.signup(credentials).subscribe({
      next: (res) => {
        this.errorMessage = '';
        this.router.navigate(['sign-in']);
      },

      error: (err) => {
        console.error('Full error', err);

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
