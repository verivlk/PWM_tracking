import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, inject } from '@angular/core';
import * as L from 'leaflet';
import { combineLatest, Subscription } from 'rxjs';

import { MapService } from '../../../services/map.service';
import { WorkerService } from '../../../services/worker.service';
import { DeviceService } from '../../../services/device.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private workerService = inject(WorkerService);
  private deviceService = inject(DeviceService);
  private mapService = inject(MapService);

  private map!: L.Map;

  private markers: L.Layer[] = [];
  private workerMarkersMap = new Map<string, { marker: L.CircleMarker, baseColor: string }>();

  private subscriptions: Subscription = new Subscription();

  ngAfterViewInit() {
    this.initMap();
    this.loadDataAndMarkers();
    this.setupMapControlSubscriptions();
  }

  private initMap(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView([27.9625, -15.594], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }

  private loadDataAndMarkers(): void {
    const dataSub = combineLatest({
      devices: this.deviceService.getDevices(),
      workers: this.workerService.getWorkers()
    }).subscribe(({ devices, workers }) => {
      this.markers.forEach(m => this.map.removeLayer(m));
      this.markers = [];
      this.workerMarkersMap.clear();

      const workerLookup = new Map(workers.map(w => [w.id, w]));

      devices.forEach(device => {
        if (device.lat && device.lon) {
          const worker = workerLookup.get(device.worker_id);
          const statusColor = worker ? (worker.statusOk ? '#2ecc71' : '#e74c3c') : 'yellow';

          const marker = L.circleMarker([device.lat, device.lon], {
            radius: 9,
            fillColor: statusColor,
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
          }).addTo(this.map);

          if (worker) {
            marker.bindTooltip(`<b>${worker.name}</b>`, { direction: 'top', offset: [0, -5] });
            marker.bindPopup(this.createPopupHtml(worker));
          }

          this.workerMarkersMap.set(device.worker_id, { marker, baseColor: statusColor });
          this.markers.push(marker);
        }
      });

      // TODO
      // KLUCZOWY MOMENT: Po narysowaniu wszystkich markerów, sprawdźmy
      // czy w serwisie już czeka jakieś ID do podświetlenia.
      const currentlyActiveIds = this.mapService.getActiveWorkerIds();
      if (currentlyActiveIds.length > 0) {
        this.applyHighlight(currentlyActiveIds);
      }
    });

    this.subscriptions.add(dataSub);
  }

  private setupMapControlSubscriptions(): void {
    // 1. Focus
    const focusSub = this.mapService.focusCoords$.subscribe(coords => {
      if (coords && coords.length > 0 && this.map) {
        if (coords.length === 1) {
          this.map.setView([coords[0].lat, coords[0].lon], 19);
        } else {
          const bounds = L.latLngBounds(coords.map(c => [c.lat, c.lon]));
          this.map.fitBounds(bounds, { padding: [50, 50] });
        }
      }
    });

    // 2. Highlight
    const highlightSub = this.mapService.activeWorkerIds$.subscribe(activeIds => {
      this.applyHighlight(activeIds);
    });

    this.subscriptions.add(focusSub);
    this.subscriptions.add(highlightSub);
  }

  // Wydzielona logika podświetlania, którą możemy wywołać w dowolnym momencie
  private applyHighlight(activeIds: string[]): void {
    if (!this.workerMarkersMap || this.workerMarkersMap.size === 0) return;

    this.workerMarkersMap.forEach((data, workerId) => {
      if (activeIds.includes(workerId)) {
        data.marker.setStyle({
          fillColor: '#3498db',
          radius: 13,
          weight: 4
        });
        data.marker.bringToFront();
      } else {
        data.marker.setStyle({
          fillColor: data.baseColor,
          radius: 9,
          weight: 2
        });
      }
    });
  }

  private createPopupHtml(worker: any): string {
    return `
      <div style="text-align: center; min-width: 150px; font-family: sans-serif;">
        ${worker.photo ? `<img src="${worker.photo}" style="width:50px; height:50px; border-radius:50%; object-fit: cover; margin-bottom:8px;">` : ''}
        <div style="font-weight: bold; font-size: 14px;">${worker.name}</div>
        <div style="font-size: 12px; color: #666; margin-bottom: 5px;">${worker.role || ''}</div>
        <div style="font-size: 11px; border-top: 1px solid #eee; padding-top: 5px;">
          📞 ${worker.phone || 'N/A'}<br>
          ✉️ ${worker.email || 'N/A'}
        </div>
      </div>
    `;
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.mapService.clearFocus();
    if (this.map) {
      this.map.remove();
    }
  }
}
