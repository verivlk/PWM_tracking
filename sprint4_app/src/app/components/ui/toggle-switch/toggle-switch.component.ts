import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './toggle-switch.html',
  styleUrls: ['./toggle-switch.css']
})
export class ToggleSwitchComponent {
  @Input() checked: boolean = false;
  @Output() changed = new EventEmitter<boolean>();

  onToggle(event: any) {
    this.changed.emit(event.detail.checked);
  }
}
