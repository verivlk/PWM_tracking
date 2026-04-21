import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import { DataService } from '../../../services/data.service'; // DOSTOSUJ TĘ ŚCIEŻKĘ!
import * as L from 'leaflet';
import { log } from 'console';

// Interfejs (możesz go przenieść do osobnego pliku, jeśli wolisz)
export interface LocalizationDevice {
  id?: string;
  lat: number;
  lon: number;
  worker_id: string;
}

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  private dataService = inject(DataService);
  private map!: L.Map;
  private markers: L.Layer[] = [];

  ngAfterViewInit() {
    this.initMap();
    this.loadDevices();
  }

private loadDevices(): void {
  this.dataService.getLocalizationDevices().subscribe(devices => {
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];

    devices.forEach(device => {
      if (device.lat && device.lon) {
        // 1. Tworzymy domyślny żółty marker (oczekiwanie na dane)
        const marker = L.circleMarker([device.lat, device.lon], {
          radius: 8,
          fillColor: 'yellow',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(this.map);

        // 2. Pobieramy status, żeby zmienić kolor
        this.dataService.getWorkerById(device.worker_id.trim()).subscribe(worker => {
          if (worker) {
            const color = worker.status === 'active' ? 'green' : 'red';
            marker.setStyle({ fillColor: color });
          } else {
            marker.setStyle({ fillColor: 'yellow' });
          }
        });

        // 3. Kliknięcie otwiera szczegóły
        marker.on('click', () => {
          this.showWorkerDetails(marker, device.worker_id);
        });
        
        this.markers.push(marker);
      }
    });
  });
}

private showWorkerDetails(marker: L.Layer, workerId: string): void {
  // Rzutowanie na CircleMarker, aby uniknąć błędów typu (jeśli marker jest typu L.Layer)
  const circleMarker = marker as L.CircleMarker;

  circleMarker.bindPopup("Ładowanie danych...").openPopup();

  this.dataService.getWorkerById(workerId.trim()).subscribe(worker => {
    if (worker) {
      // Budujemy bardziej rozbudowany HTML z danymi pracownika
      const popupContent = `
        <div style="text-align: center; line-height: 1.5;">
          ${worker.photo ? `<img src="${worker.photo}" style="width:60px; border-radius:50%; margin-bottom:10px;"><br>` : ''}
          <b style="font-size: 1.1em;">${worker.name || 'Brak imienia'}</b><br>
          <div style="color: #666; font-size: 0.9em;">${worker.role || ''}</div>
          <hr style="margin: 8px 0;">
          <div style="text-align: left; font-size: 0.85em;">
            <b>Email:</b> ${worker.email || 'N/A'}<br>
            <b>Telefon:</b> ${worker.phone || 'N/A'}<br>
            </span>
          </div>
        </div>
      `;
      
      circleMarker.setPopupContent(popupContent);
    } else {
      circleMarker.setPopupContent("Nie znaleziono szczegółowych danych pracownika.");
    }
  });
}

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([27.9625, -15.594], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}