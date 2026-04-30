import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toggle-switch.html',
  styleUrls: ['./toggle-switch.css']
})
export class ToggleSwitchComponent {
  // Riceve lo stato (acceso/spento) dal padre
  @Input() checked: boolean = false;

  // Emette il nuovo stato quando l'utente clicca
  @Output() changed = new EventEmitter<boolean>();

  onToggle(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.changed.emit(inputElement.checked);
  }
}
