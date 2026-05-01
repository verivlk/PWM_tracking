import { Component, OnInit, signal, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SettingItemComponent } from '../../components/shared/setting-item/setting-item';
import { InputFieldComponent } from '../../components/ui/input-field/input-field';
import { DataService } from '../../services/data.service';
import { SettingsService } from '../../services/settings.service'; // <-- Importa il Service

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SettingItemComponent, InputFieldComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private dataService = inject(DataService);
  private settingsService = inject(SettingsService); // <-- Inietta il Service
  private fb = inject(FormBuilder);
  private auth = inject(Auth);

  // Stato dell'applicazione
  sections = signal<any[]>([]);
  selectedItem = signal<any>(null);
  isMobileMenuOpen = signal(false);
  isDarkMode = signal(localStorage.getItem('darkMode') === 'enabled');

  // Form
  settingsForm: FormGroup = this.fb.group({});

  ngOnInit() {
    this.dataService.getSettings().subscribe({
      next: (data) => {
        this.sections.set(data);
        this.applyTheme(this.isDarkMode());
      },
      error: (err) => console.error('Data load error:', err)
    });
  }

  getControl(name: string): FormControl {
    return this.settingsForm.get(name) as FormControl;
  }

  selectItem(item: any) {
    if (item.type === 'toggle') return;

    this.selectedItem.set(item);

    // Generazione dinamica dei form basata su item.fields
    const group: any = {};
    if (item.fields) {
      item.fields.forEach((field: any) => {
        group[field.label] = new FormControl('', field.required ? [] : []);
      });
    }
    this.settingsForm = new FormGroup(group);
    this.isMobileMenuOpen.set(true);
  }

  // --- LOGICA DARK MODE (FIRESTORE) ---
  handleToggle(item: any, value: boolean) {
    if (item.label === 'Dark Mode') {
      // 1. Aggiorna la UI locale
      this.isDarkMode.set(value);
      this.applyTheme(value);
      localStorage.setItem('darkMode', value ? 'enabled' : 'disabled');

      // 2. Aggiorna il database Firestore!
      // Mappiamo sul campo "darkmode" visto nel tuo ERD in minuscolo
      this.settingsService.updateUserPreferences({ darkmode: value }).subscribe({
        next: () => console.log('Dark mode aggiornata in Firestore!'),
        error: (err) => console.error('Errore Firestore:', err)
      });
    }
  }

  private applyTheme(dark: boolean) {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  // --- LOGICA EMAIL E PASSWORD (FIREBASE AUTH) ---
  saveSettings() {
    if (this.settingsForm.invalid) {
      alert("Please fill all required fields correctly.");
      return;
    }

    const currentItem = this.selectedItem();
    const formData = this.settingsForm.value;

    // --- 1. LOGICA CHANGE PASSWORD ---
    if (currentItem.label === 'Change Password') {
      const newPassword = formData['New Password'];
      const confirmPassword = formData['Confirm New Password'];

      if (newPassword !== confirmPassword) {
        alert("The new passwords do not match!");
        return;
      }

      this.settingsService.updateAccountPassword(newPassword).subscribe({
        next: () => {
          alert('Password updated successfully!');
          this.closePanel();
        },
        error: (err) => alert('Error updating password: ' + err.message)
      });
    }

    // --- 2. LOGICA CHANGE EMAIL ---
    else if (currentItem.label === 'Change Email') {
      const currentEmailInput = formData['Current Email Address'];
      const newEmailInput = formData['New Email Address'];
      const confirmNewEmailInput = formData['Confirm New Email']; // <-- Peschiamo il nuovo campo
      const actualUserEmail = this.auth.currentUser?.email;

      // Controllo 1: L'email attuale inserita corrisponde a quella loggata?
      if (currentEmailInput !== actualUserEmail) {
        alert("The current email you entered is incorrect.");
        return;
      }

      // Controllo 2: Le due nuove email coincidono?
      if (newEmailInput !== confirmNewEmailInput) {
        alert("The new email addresses do not match!");
        return;
      }

      // Tutto corretto: procediamo con il salvataggio
      this.settingsService.updateAccountEmail(newEmailInput).subscribe({
        next: () => {
          alert('Email updated successfully!');
          this.closePanel();
        },
        error: (err) => alert('Error updating email: ' + err.message)
      });
    }

    // --- IGNORA TEMPORANEAMENTE WORKER/ADMIN ---
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
