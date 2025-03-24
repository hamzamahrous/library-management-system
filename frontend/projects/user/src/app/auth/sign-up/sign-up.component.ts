import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LogoComponent } from '../../../../../shared-lib/src/lib/logo/logo.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [LogoComponent, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css',
})
export class SignUpComponent {
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

    console.log('Sign-in data:', this.form.value);
  }
}
