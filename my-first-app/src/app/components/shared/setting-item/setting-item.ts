import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitchComponent } from '../../ui/toggle-switch/toggle-switch';

@Component({
  selector: 'app-setting-item',
  standalone: true,
  imports: [CommonModule, ToggleSwitchComponent],
  templateUrl: './setting-item.html',
  styleUrls: ['./setting-item.css']
})
export class SettingItemComponent {
  @Input() label!: string;
  @Input() description?: string;
  @Input() type: 'button' | 'toggle' = 'button';
  @Input() isActive: boolean = false;
  @Input() toggleValue: boolean = false;

  @Output() itemClick = new EventEmitter<void>();
  @Output() toggleChange = new EventEmitter<boolean>();

  handleContainerClick() {
    if (this.type === 'button') {
      this.itemClick.emit();
    }
  }
}