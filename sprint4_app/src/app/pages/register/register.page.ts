import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
// Make sure this path points correctly to where you pasted your AuthService
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {
  imageFile: File | null = null;


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  // Triggered when the user selects an image file
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
    }
  }

  async onRegister(form: NgForm) {
    if (form.invalid || !this.imageFile) return;

    const { email, password, name, surname } = form.value;

    try {
      // 1. You will need to ensure your AuthService handles the new parameters
      // specifically passing the name, surname, and the imageFile.
      await this.authService.registerNewSupervisor(email, password, name, surname, this.imageFile);

      this.presentToast('Registration successful! Welcome.', 'success');
      form.reset();
      this.router.navigate(['/favorites']); // Route to Screen 3

    } catch (error: any) {
      this.presentToast('Error: ' + error.message, 'danger');
    }
  }

  // Helper to show a quick native-looking popup message
  async presentToast(message: string, color: 'success' | 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
