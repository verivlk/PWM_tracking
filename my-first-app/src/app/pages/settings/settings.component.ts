import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { SettingItemComponent } from '../../components/shared/setting-item/setting-item';
import { InputFieldComponent } from '../../components/ui/input-field/input-field';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, SettingItemComponent, InputFieldComponent, ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  private dataService = inject(DataService);
  private fb = inject(FormBuilder);

  // Stan aplikacji
  sections = signal<any[]>([]);
  selectedItem = signal<any>(null);
  isMobileMenuOpen = signal(false);
  isDarkMode = signal(localStorage.getItem('darkMode') === 'enabled');
  
  // Formularz
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

  // Pobieranie kontrolki dla HTML
  getControl(name: string): FormControl {
    return this.settingsForm.get(name) as FormControl;
  }

  selectItem(item: any) {
    if (item.type === 'toggle') return;

    this.selectedItem.set(item);
    
    // Generowanie dynamiczne pól formularza
    const group: any = {};
    if (item.fields) {
      item.fields.forEach((field: any) => {
        group[field.label] = new FormControl('', field.required ? [] : []); // Tutaj można dodać Validators.required
      });
    }
    this.settingsForm = new FormGroup(group);
    this.isMobileMenuOpen.set(true);
  }

  handleToggle(item: any, value: boolean) {
    if (item.label === 'Dark Mode') {
      this.isDarkMode.set(value);
      this.applyTheme(value);
      localStorage.setItem('darkMode', value ? 'enabled' : 'disabled');
    }
  }

  private applyTheme(dark: boolean) {
    if (dark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  saveSettings() {
    if (this.settingsForm.valid) {
      console.log('Saving data:', this.settingsForm.value);
      // Tutaj logika zapisu do Firebase/API
      this.closePanel();
    }
  }

  closePanel() {
    this.isMobileMenuOpen.set(false);
    this.selectedItem.set(null);
  }
}