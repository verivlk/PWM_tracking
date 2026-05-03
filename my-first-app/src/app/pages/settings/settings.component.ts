import { Component, OnInit, signal, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';

import { SettingItemComponent } from '../../components/shared/setting-item/setting-item';
import { InputFieldComponent } from '../../components/ui/input-field/input-field';

import { AuthService } from '../../services/auth.service'
import {UserService} from '../../services/user.service';

import { SETTINGS_CONFIG } from '../../config/settings.config';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SettingItemComponent, InputFieldComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private authService = inject(AuthService);
  private userService = inject(UserService);

  private fb = inject(FormBuilder);

  sections = signal<any[]>([]);
  selectedItem = signal<any>(null);
  isMobileMenuOpen = signal(false);
  isDarkMode = signal(false);

  // Form
  settingsForm: FormGroup = this.fb.group({});

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
        group[field.label] = new FormControl('', field.required ? [] : []);
      });
    }
    this.settingsForm = new FormGroup(group);
    this.isMobileMenuOpen.set(true);
  }

  // --- DARK MODE (FIRESTORE) ---
  handleToggle(item: any, value: boolean) {
    if (item.label !== 'Dark Mode')
      return;
    this.isDarkMode.set(value);
    this.applyTheme(value);
    localStorage.setItem('darkMode', value ? 'enabled' : 'disabled');

    this.userService.updatePreferences({ darkMode: value }).subscribe({
      next: () => console.log('Dark mode updated in Firestore!'),
      error: (err) => console.error('Error in Firestore: ', err)
    });

  }

  private applyTheme(dark: boolean) {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // --- EMAIL AND PASSWORD (FIREBASE AUTH) ---
  saveSettings() {
    if (this.settingsForm.invalid) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const currentItem = this.selectedItem();
    const formData = this.settingsForm.value;

    // --- 1. CHANGE PASSWORD ---
    if (currentItem.label === 'Change Password') {
      const newPassword = formData['New Password'];
      const confirmPassword = formData['Confirm New Password'];

      if (newPassword !== confirmPassword) {
        alert("The new passwords do not match!");
        return;
      }

      this.authService.updatePassword(newPassword).subscribe({
        next: () => {
          alert('Password updated successfully!');
          this.closePanel();
        },
        error: (err) => alert('Error updating password: ' + err.message)
      });
    }

    // --- 2. CHANGE EMAIL ---
    else if (currentItem.label === 'Change Email') {
      const currentEmailInput = formData['Current Email Address'];
      const newEmailInput = formData['New Email Address'];
      const confirmNewEmailInput = formData['Confirm New Email'];

      if (newEmailInput !== confirmNewEmailInput) {
        alert("The new email addresses do not match!");
        return;
      }

      this.authService.updateEmail(newEmailInput).subscribe({
        next: () => {
          alert('Email updated successfully!');
          this.closePanel();
        },
        error: (err) => alert('Error updating email: ' + err.message)
      });
    }

    // TODO --- IGNORA TEMPORANEAMENTE WORKER/ADMIN ---
    else {
      alert("This feature is currently disabled in this view.");
      this.closePanel();
    }
  }
  closePanel() {
    this.isMobileMenuOpen.set(false);
    this.selectedItem.set(null);
  }
}
