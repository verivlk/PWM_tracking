import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  // Make sure ReactiveFormsModule and RouterModule are imported here!
  imports: [IonicModule, CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginPage {
  loginForm: FormGroup;

  // Modern dependency injection
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastController = inject(ToastController);
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      // Call the Bouncer (AuthService) [cite: 14]
      this.authService.login(email, password).subscribe({
        next: async () => {
          const toast = await this.toastController.create({
            message: 'Login successful!',
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();

          // Redirect to the new Sprint 4 Favorites/List screen
          this.router.navigate(['/dashboard']);
        },
        error: async (err) => {
          console.error('Entry Denied:', err);
          const toast = await this.toastController.create({
            message: 'Invalid email or password. Please try again.',
            duration: 3000,
            color: 'danger',
            position: 'bottom'
          });
          await toast.present();
        }
      });
    } else {
      // If they click submit with an invalid form, mark all as touched to show errors
      this.loginForm.markAllAsTouched();
    }
  }
}
