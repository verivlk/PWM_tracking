import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  // To pozwoli nam wysłać wpisany tekst do Dashboardu
  @Output() searchChange = new EventEmitter<string>();

  onInput(event: any) {
    const value = event.target.value;
    this.searchChange.emit(value);
  }
}