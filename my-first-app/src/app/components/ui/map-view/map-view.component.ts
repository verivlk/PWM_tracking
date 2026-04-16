import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private map!: L.Map;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap(): void {
    // 1. Initialize map
    this.map = L.map(this.mapContainer.nativeElement).setView([27.9625, -15.594], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // 2. Watch the container for any physical size changes to prevent grey squares
    this.resizeObserver = new ResizeObserver(() => {
      if (this.map) {
        this.map.invalidateSize();
      }
    });

    // Start observing the map container
    this.resizeObserver.observe(this.mapContainer.nativeElement);
  }

  ngOnDestroy() {
    // 3. Clean up to prevent memory leaks in Angular
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.map) {
      this.map.remove();
    }
  }
}
