import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from '../../components/ui/map-view/map-view.component';
import { WorkerRowComponent } from '../../components/shared/worker-row/worker-row.component';
import { SearchBar } from '../../components/ui/search-bar/search-bar'; // Import search bara
import { DataService } from '../../services/data.service';
import { MapService } from '../../services/map.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapViewComponent, WorkerRowComponent, SearchBar], // Dodany SearchBar
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  workersMap: { [id: string]: any } = {};

  constructor(private dataService: DataService, private mapService: MapService) {}

  ngOnInit() {
      // Pobieramy zespoły i pracowników jednocześnie
      combineLatest({
        teams: this.dataService.getTeams(),
        workers: this.dataService.getWorkers()
      }).subscribe(({ teams, workers }) => {
        console.log('Dane przyszły!', teams, workers); // Sprawdź w konsoli F12 czy to się wyświetla
        
        workers.forEach(w => {
          if (w.id) this.workersMap[w.id] = w;
        });
      
        this.teams = teams.map(team => ({
          ...team,
          isExpanded: false,
          resolvedMembers: (team.workers || []).map((id: string) => this.workersMap[id])
        }));
      
        this.filteredTeams = this.teams;
      });
  }
  toggleDetails(team: any) {
    team.isExpanded = !team.isExpanded;
    
    if (team.isExpanded) {
    this.dataService.getLocalizationDevices().subscribe(devices => {
      const teamDevices = devices.filter(d => team.workers?.includes(d.worker_id));
      const teamCoords = teamDevices.map(d => ({ lat: d.lat, lon: d.lon }));

      if (teamCoords.length > 0) {
        this.mapService.setFocus(teamCoords, team.workers);
      }
    });
  } else {
    this.mapService.setFocus([], []);
  }
  }

  onSearch(query: string) {
    const term = query.toLowerCase().trim();
    
    if (!term) {
      this.filteredTeams = this.teams;
      return;
    }

    this.filteredTeams = this.teams.filter(team => 
      team.name.toLowerCase().includes(term) || 
      team.project?.toLowerCase().includes(term) ||
      team.members?.some((m: any) => m.name.toLowerCase().includes(term))
    );
  }
}