import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerRowComponent } from '../../components/shared/worker-row/worker-row.component';
import { SearchBar } from '../../components/ui/search-bar/search-bar'; // Import komponentu
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, WorkerRowComponent, SearchBar], // Dodany SearchBar
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamDetailComponent implements OnInit {
  team: any;
  workers: any[] = [];
  filteredWorkers: any[] = []; // Tablica na wyniki wyszukiwania
  selectedWorker: any = null;

  constructor(
    private dataService: DataService,
    private mapService: MapService,
    private router: Router
  ) {}

  ngOnInit() {
    // const id = this.route.snapshot.paramMap.get('id');
    this.dataService.getWorkers().subscribe(data => {
      this.workers = data;
      this.filteredWorkers = data;

      // Opcjonalnie: zaznacz pierwszego pracownika na starcie
      if (this.workers.length > 0) {
        this.selectedWorker = this.workers[0];
      }
    });
  }

  onSearch(query: string) {
    const term = query.toLowerCase().trim();
    if (!term) {
      this.filteredWorkers = this.workers;
      return;
    }

    this.filteredWorkers = this.workers.filter(worker =>
      worker.name.toLowerCase().includes(term) ||
      worker.role?.toLowerCase().includes(term) ||
      worker.email?.toLowerCase().includes(term)
    );
  }

  goToWorkerOnMap(workerId: string) {
  this.dataService.getLocalizationDevices().subscribe(devices => {
    const device = devices.find(d => d.worker_id.trim() === workerId.trim());

    if (device) {
      this.mapService.setFocus(
        [{ lat: device.lat, lon: device.lon }],
        [workerId.trim()]
      );

      this.router.navigate(['/map']);
    } else {
      alert('Localization not found for this worker');
    }
  });
}
}
