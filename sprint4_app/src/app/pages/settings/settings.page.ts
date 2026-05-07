import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { switchMap } from 'rxjs';

import { SettingItemComponent } from '../../components/shared/setting-item/setting-item.component';
import { InputFieldComponent } from '../../components/ui/input-field/input-field.component';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { SETTINGS_CONFIG } from '../../config/settings.config';

// Import icons
import { addIcons } from 'ionicons';
import { settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule, SettingItemComponent, InputFieldComponent],
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss']
})
export class SettingsPage implements OnInit {

  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private toastController = inject(ToastController);

  sections = signal<any[]>([]);
  selectedItem = signal<any>(null);
  isModalOpen = signal(false); // Replaces isMobileMenuOpen
  isDarkMode = signal(false);

  settingsForm: FormGroup = this.fb.group({});

  constructor() {
    addIcons({ settingsOutline });
  }

  ngOnInit() {
    this.sections.set(SETTINGS_CONFIG);

    this.userService.userProfile$.subscribe(user => {
      if (!user) return;
      const dark = user.darkMode ?? false;
      this.isDarkMode.set(dark);
      this.applyTheme(dark);
      localStorage.setItem('darkMode', dark ? 'enabled' : 'disabled');
    });
  }

  getControl(name: string): FormControl {
    return this.settingsForm.get(name) as FormControl;
  }

  selectItem(item: any) {
    if (item.type === 'toggle') return;

    this.selectedItem.set(item);

    const group: any = {};
    if (item.fields) {
      item.fields.forEach((field: any) => {
        group[field.label] = new FormControl('', field.validators ?? []);
      });
    }
    this.settingsForm = new FormGroup(group);

    // Open the mobile modal instead of the right panel
    this.isModalOpen.set(true);
  }

  // --- DARK MODE ---
  handleToggle(item: any, value: boolean) {
    if (item.label !== 'Dark Mode') return;

    this.isDarkMode.set(value);
    this.applyTheme(value);
    localStorage.setItem('darkMode', value ? 'enabled' : 'disabled');

    this.userService.updatePreferences({ darkMode: value }).subscribe({
      next: () => console.log('Dark mode updated!'),
      error: (err) => console.error('Error: ', err)
    });
  }

  private applyTheme(dark: boolean) {
    // Standard Ionic Dark Mode implementation
    document.body.classList.toggle('dark', dark);
  }

  // --- FORM SUBMISSION ---
  async saveSettings() {
    if (this.settingsForm.invalid) {
      this.settingsForm.markAllAsTouched();
      this.showToast('Please fill all required fields correctly.', 'danger');
      return;
    }

    const currentItem = this.selectedItem();
    const formData = this.settingsForm.value;

    if (currentItem.id === 'password') {
      const currentPassword = formData.currentPassword;
      const newPassword = formData['New Password'];
      const confirmPassword = formData['Confirm New Password'];

      if (newPassword !== confirmPassword) {
        this.showToast('The new passwords do not match!', 'danger');
        return;
      }

      this.authService.reauthenticate(currentPassword).pipe(
        switchMap(() => this.authService.updatePassword(newPassword))
      ).subscribe({
        next: () => {
          this.showToast('Password successfully updated!', 'success');
          this.closePanel();
        },
        error: (err) => this.showToast(this.authService.mapAuthError(err), 'danger')
      });
    }
    else if (currentItem.label === 'Change Email') {
      const currentPassword = formData['Current Password'];
      const newEmail = formData['New Email Address'];
      const confirmNewEmail = formData['Confirm New Email'];

      if (newEmail !== confirmNewEmail) {
        this.showToast('The new email addresses do not match!', 'danger');
        return;
      }

      this.authService.reauthenticate(currentPassword).pipe(
        switchMap(() => this.authService.updateEmail(newEmail))
      ).subscribe({
        next: () => {
          this.showToast('E-mail successfully updated!', 'success');
          this.closePanel();
        },
        error: (err) => this.showToast(this.authService.mapAuthError(err), 'danger')
      });
    }
    else {
      this.showToast('This feature is currently disabled.', 'warning');
      this.closePanel();
    }
  }

  closePanel() {
    this.isModalOpen.set(false);
    // Slight delay before clearing so the modal slide-down animation finishes first
    setTimeout(() => this.selectedItem.set(null), 300);
  }

  private async showToast(msg: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}
