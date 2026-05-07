import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-setting-item',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.scss']
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

  onToggle(event: any) {
    // Emits the new boolean state of the toggle
    this.toggleChange.emit(event.detail.checked);
  }
}
