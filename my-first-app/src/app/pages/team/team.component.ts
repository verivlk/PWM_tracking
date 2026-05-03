import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, ActivatedRoute} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {WorkerRowComponent} from '../../components/shared/worker-row/worker-row.component';
import {SearchBar} from '../../components/ui/search-bar/search-bar';

// import { DataService } from '../../services/data.service';
import {MapService} from '../../services/map.service';
import {WorkerService} from '../../services/worker.service';
import {DeviceService} from '../../services/device.service';

import {Team} from '../../models/team.model';
import {Worker} from '../../models/worker.model';
import {TeamService} from '../../services/team.service';

@Component({
  selector: 'app-team-detail',
  standalone: true,
  imports: [CommonModule, WorkerRowComponent, SearchBar, FormsModule],
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamDetailComponent implements OnInit {
  team?: Team;  // although we always should have a team
  workers: Worker[] = [];
  filteredWorkers: Worker[] = [];
  selectedWorker: Worker | null = null;

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private teamService: TeamService = inject(TeamService);
  private workerService = inject(WorkerService);
  private deviceService = inject(DeviceService);
  private mapService = inject(MapService);

  // edit state
  editMode = false;
  editWorker: Partial<Worker> = {};

  ngOnInit() {
    const teamId = this.route.snapshot.paramMap.get('teamId');
    console.log('teamId: ', teamId);  // TODO debug
    if (!teamId) return;

    // load team
    this.teamService.getTeamById(teamId).subscribe(team => {
      this.team = team;
    });

    this.workerService.getWorkersByTeam(teamId).subscribe(workers => {
      this.workers = workers;
      this.filteredWorkers = workers;

      console.log('workers: ', workers); // TODO debug

/*
      // TODO Opcjonalnie: zaznacz pierwszego pracownika na starcie
      if (this.workers.length > 0) {
        this.selectedWorker = this.workers[0];
      }
*/
    });
  }

  // select worker
  selectWorker(worker: Worker) {
    this.selectedWorker = worker;
    this.editMode = false;
  }

  onSearch(query: string): void {
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

  goToWorkerOnMap(workerId?: string) {
    if (!workerId) return;

    this.deviceService.getDeviceByWorkerId(workerId).subscribe(device => {

      if (!device) {
        alert('Localization not found for this worker');
        return;
      }

      this.mapService.setFocus(
        [{lat: device.lat, lon: device.lon}],
        [workerId]
      );

      this.router.navigate(['/map']).then(success => {
        if (!success) {
          console.warn('Navigation failed');
        }
      });
    });
  }

  // EDIT MODE
  startEdit() {
    if (!this.selectedWorker) return;

    this.editMode = true;
    this.editWorker = { ...this.selectedWorker };     // clone object
  }

  cancelEdit() {
    this.editMode = false;
    this.editWorker = {};
  }

  saveEdit() {
    if (!this.selectedWorker?.id) return;

    this.workerService.updateWorker(
      this.selectedWorker.id,
      this.editWorker
    ).subscribe({
      next: () => {
        this.selectedWorker = {
          ...this.selectedWorker!,
          ...this.editWorker
        };

        this.editMode = false;
      },
      error: (err) => console.error('Update failed', err)
    });
  }


}
