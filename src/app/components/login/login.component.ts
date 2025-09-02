import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../core/interceptor/auth.service';
import { AlertService } from '../../shared/alert/service/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  signupForm: FormGroup;
  isSignUp = false;

  loadingLogin = false;
loadingSignup = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertService: AlertService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleForm() {
    this.isSignUp = !this.isSignUp;
    this.loginForm.reset()
    this.signupForm.reset()
  }

  passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { mismatch: true } : null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.loadingLogin = true;
      this.authService.login( email, password ).subscribe({
        next: (res) => {
          this.alertService.showAlert({
            message: 'Login successful',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.isSignUp = false
          this.router.navigate(['/products'])
          this.loadingLogin = false;
        },
        error: (err) => {
          this.alertService.showAlert({
            message: err.error.message,
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
          this.loadingLogin = false;
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onSubmitSignUp() {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authService.signup({ email, password }).subscribe({
        next: (res) => {
          this.alertService.showAlert({
            message: 'Signup successful',
            type: 'success',
            autoDismiss: true,
            duration: 4000
          });
          this.isSignUp = false;
          this.loadingSignup = true;
        },
        error: (err) => {
          this.alertService.showAlert({
            message: err.error.message,
            type: 'error',
            autoDismiss: true,
            duration: 4000
          });
          this.loadingSignup = true;
        }
      });
    } else {
      this.signupForm.markAllAsTouched();
    }
  }

  get lf() {
    return this.loginForm.controls;
  }

  get sf() {
    return this.signupForm.controls;
  }
}
