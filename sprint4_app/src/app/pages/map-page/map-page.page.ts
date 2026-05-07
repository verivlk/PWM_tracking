import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

// IMPORTANT: Make sure this path points correctly to where you saved your map-view component!
import { MapViewComponent } from '../../components/ui/map-view/map-view.component';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [CommonModule, IonicModule, MapViewComponent],
  templateUrl: './map-page.page.html',
  styleUrls: ['./map-page.page.scss']
})
export class MapPage {
  constructor() {}
}
