import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-box"> <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <div class="input-group"> <label for="email">Email</label>
              <input id="email" type="email" formControlName="email" placeholder="Enter email">
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="error-msg">
                Valid email is required.
              </div>
          </div>

          <div class="input-group">
              <label for="password">Password</label>
              <input id="password" type="password" formControlName="password" placeholder="Enter password">
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="error-msg">
                Password is required (min 6 chars).
              </div>
          </div>

          <button type="submit" class="btn" [disabled]="loginForm.invalid">Submit</button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Form data:', this.loginForm.value);
      // Tutaj w przyszłości podepniesz Firebase Authentication (Wymaganie 5)
    }
  }
}
