import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
// 1. IMPORTA ADDICONS E L'ICONA
import { addIcons } from 'ionicons';
import { arrowBackOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {
  constructor() {
    addIcons({ arrowBackOutline });
  }
  step = 1;
  confirmPassword = '';

  userData = {
    name: '',
    surname: '',
    email: '',
    password: '',
    profileImageUrl: ''
  };

  private authService = inject(AuthService);
  private navCtrl = inject(NavController);
  private loadingCtrl = inject(LoadingController);
  private toastCtrl = inject(ToastController);

  nextStep() {
    if (!this.userData.name || !this.userData.surname || !this.userData.email) {
      this.showToast('Please fill in all the fields before continuing.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.userData.email)) {
      this.showToast('Please enter a valid email address.');
      return;
    }

    this.step = 2;
  }

  goBack() {
    if (this.step === 2) {
      this.step = 1;
    } else {
      this.navCtrl.back();
    }
  }

  uploadProfileImage() {
    this.userData.profileImageUrl = 'https://ionicframework.com/docs/img/demos/avatar.svg';
    this.showToast('Profile image selected successfully.');
  }

  async register() {
    if (!this.userData.password || !this.confirmPassword) {
      this.showToast('Please enter and confirm your password.');
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.showToast('Passwords do not match. Please try again.');
      return;
    }

    if (this.userData.password.length < 6) {
      this.showToast('Password should be at least 6 characters long.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Creating your account...',
    });
    await loading.present();

    try {
      await this.authService.register(this.userData);
      await loading.dismiss();
      this.navCtrl.navigateRoot('/courses-dashboard');
    } catch (error: any) {
      await loading.dismiss();
      this.showToast(error.message || 'Registration failed. Please try again.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }
}
