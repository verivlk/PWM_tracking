import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  // Pobieramy referencję do diva z HTMLa
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  private map!: L.Map;

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // Inicjalizacja mapy na konkretnym elemencie
    this.map = L.map(this.mapContainer.nativeElement).setView([27.9625, -15.594], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Twoje zabezpieczenie przed błędami renderowania
    setTimeout(() => {
      this.map.invalidateSize();
    }, 200);
  }

  ngOnDestroy() {
    // Ważne w Angularze: sprzątamy mapę przy zmianie strony
    if (this.map) {
      this.map.remove();
    }
  }
}
