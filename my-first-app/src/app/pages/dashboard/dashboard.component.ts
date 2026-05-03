import {Component, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {combineLatest, EMPTY, switchMap, tap} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';

import {MapViewComponent} from '../../components/ui/map-view/map-view.component';
import {WorkerRowComponent} from '../../components/shared/worker-row/worker-row.component';
import {SearchBar} from '../../components/ui/search-bar/search-bar';

import {MapService} from '../../services/map.service';
import {TeamService} from '../../services/team.service';
import {WorkerService} from '../../services/worker.service';
import {DeviceService} from '../../services/device.service';
import {AuthService} from '../../services/auth.service';

import {Worker} from '../../models/worker.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapViewComponent, WorkerRowComponent, SearchBar],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  teams: any[] = [];
  filteredTeams: any[] = [];
  workersMap: { [id: string]: any } = {};

  private teamService: TeamService = inject(TeamService);
  private workerService = inject(WorkerService);
  private deviceService = inject(DeviceService);
  private mapService = inject(MapService);
  private authService: AuthService = inject(AuthService);
  private router = inject(Router);

  selectedWorker: Worker | null = null;
  expandedWorkers: Record<string, boolean> = {};

  workers = toSignal(
    this.authService.user$.pipe(
      tap(user => console.log('auth user:', user)), // TODO debug
      switchMap(user => user
        ? this.workerService.getActiveWorkersByManager(user.uid)
        : EMPTY
      ),
      tap(workers => console.log('workers from API:', workers)) // TODO debug
    ),
    {initialValue: []}
  );

  filteredWorkers = signal<Worker[]>([]);

  constructor() {
    effect(() => {
      const workers = this.workers();

      if (!workers.length) return;

      // init list for UI
      this.filteredWorkers.set(workers);

    }, {allowSignalWrites: true});
  }

  onSearch(query: string) {
    const term = query.toLowerCase().trim();
    const workers = this.workers();

    if (!term) {
      this.filteredWorkers.set(workers);
      return;
    }

    this.filteredWorkers.set(
      workers.filter(worker =>
        worker.name.toLowerCase().includes(term) ||
        worker.role?.toLowerCase().includes(term) ||
        worker.email?.toLowerCase().includes(term))
    );
  }


  ngOnInit() {
    // Pobieramy zespoły i pracowników jednocześnie
    combineLatest({
      teams: this.teamService.getTeams(),
      workers: this.workerService.getWorkers()
    }).subscribe(({teams, workers}) => {
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


  toggleWorker(worker: Worker) {
    const workerId = worker.id;
    if (!workerId) {
      return;
    }
    this.expandedWorkers[workerId] = !this.expandedWorkers[workerId];

    if (this.expandedWorkers[workerId]) {
      this.deviceService.getDevices().subscribe(devices => {
        const workerDevice = devices.find(
          d => d.assignedWorkerId === worker.id
        );

        if (workerDevice) {
          const coords = [{
            lat: workerDevice.lat,
            lon: workerDevice.lon
          }];

          this.mapService.setFocus(coords, [workerId]);
        }

      });
    } else {
      this.mapService.setFocus([], []);
    }
  }

  openWorker(worker: Worker) {
    console.log("clicked"); // TODO debug
    this.router.navigate(['/team', worker.teamId], {
      queryParams: {
        worker: worker.id
      }
    });
  }



  toggleDetails(team: any) {
    team.isExpanded = !team.isExpanded;

    if (team.isExpanded) {
      this.deviceService.getDevices().subscribe(devices => {
        const teamDevices = devices.filter(d => team.workers?.includes(d.assignedWorkerId));
        const teamCoords = teamDevices.map(d => ({lat: d.lat, lon: d.lon}));

        if (teamCoords.length > 0) {
          this.mapService.setFocus(teamCoords, team.workers);
        }
      });
    } else {
      this.mapService.setFocus([], []);
    }
  }


}
