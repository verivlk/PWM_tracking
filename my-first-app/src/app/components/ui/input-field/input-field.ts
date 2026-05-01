import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-field.html',
  styleUrls: ['./input-field.css']
})
export class InputFieldComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;

  // Variabile per tracciare se la password è visibile
  isPasswordVisible: boolean = false;

  // Funzione per alternare la visibilità
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
