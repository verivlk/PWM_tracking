import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent {
  @Output() searchChange = new EventEmitter<string>();

  onInput(event: any) {
    // Ionic passes the value inside event.target.value
    const value = event.target.value || '';
    this.searchChange.emit(value);
  }
}
