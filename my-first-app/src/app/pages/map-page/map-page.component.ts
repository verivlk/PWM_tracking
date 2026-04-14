import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from '../../components/ui/map-view/map-view.component';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, MapViewComponent],
  template: `
    <main class="full-page-map">
      <app-map-view></app-map-view>
    </main>
  `,
  styles: [`
    .full-page-map {
      width: 100vw;
      height: 100vh; /* Mapa na cały ekran */
      display: block;
    }
  `]
})
export class MapPageComponent {}
