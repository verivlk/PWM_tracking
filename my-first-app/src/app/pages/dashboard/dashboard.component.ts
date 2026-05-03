import {Component, inject, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

import { MapViewComponent } from '../../components/ui/map-view/map-view.component';
import { WorkerRowComponent } from '../../components/shared/worker-row/worker-row.component';
import { SearchBar } from '../../components/ui/search-bar/search-bar';

import { MapService } from '../../services/map.service';
import {TeamService} from '../../services/team.service';
import {WorkerService} from '../../services/worker.service';
import {DeviceService} from '../../services/device.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapViewComponent, WorkerRowComponent, SearchBar],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = [];
  workersMap: { [id: string]: any } = {};

  private teamService: TeamService = inject(TeamService);
  private workerService = inject(WorkerService);
  private deviceService = inject(DeviceService);
  private mapService = inject(MapService);


  ngOnInit() {
      // Pobieramy zespoły i pracowników jednocześnie
      combineLatest({
        teams: this.teamService.getTeams(),
        workers: this.workerService.getWorkers()
      }).subscribe(({ teams, workers }) => {
        console.log('Data loaded: ', teams, workers); // TODO remove debug

        const workerById = new Map(workers.map(w => [w.id, w]));

        workers.forEach(w => {
          if (w.id) this.workersMap[w.id] = w;
        });

        this.teams = teams.map(team => ({
          ...team,
          isExpanded: false,
          // resolvedMembers: (team.workers || []).map((id: string) => this.workersMap[id])
        }));

        this.filteredTeams = this.teams;
      });
  }
  toggleDetails(team: any) {
    team.isExpanded = !team.isExpanded;

    if (team.isExpanded) {
    this.deviceService.getDevices().subscribe(devices => {
      const teamDevices = devices.filter(d => team.workers?.includes(d.assignedWorkerId));
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
