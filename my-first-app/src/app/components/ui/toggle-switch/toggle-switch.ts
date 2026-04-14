import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  templateUrl: './toggle-switch.html',
  styleUrls: ['./toggle-switch.css']
})
export class ToggleSwitchComponent {
  @Input() checked: boolean = false;
  @Output() changed = new EventEmitter<boolean>();

  onToggle(event: Event) {
    const input = event.target as HTMLInputElement;
    this.changed.emit(input.checked);
  }
}