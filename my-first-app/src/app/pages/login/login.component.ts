import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // <-- Added Router
import { AuthService } from '../../services/auth.service'; // <-- Added AuthService
import { InputFieldComponent } from '../../components/ui/input-field/input-field';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputFieldComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = ''; // <-- Added to show errors to the user

  // Modern dependency injection
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  getEmailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  getPasswordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // 1. Grab the values from the form
      const { email, password } = this.loginForm.value;

      // 2. Clear any old errors
      this.errorMessage = '';

      // 3. Call the Bouncer (AuthService)
      this.authService.login(email, password).subscribe({
        next: () => {
          console.log('Login successful!');
          // 4. Redirect to the dashboard!
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Entry Denied:', err);
          // 5. Show error to the user
          this.errorMessage = 'Invalid email or password. Please try again.';
        }
      });
    }
  }
}
