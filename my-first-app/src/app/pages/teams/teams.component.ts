import { Component, OnInit, signal, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Observable, switchMap, EMPTY, tap, map, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { SearchBar } from '../../components/ui/search-bar/search-bar';
import { TeamRowComponent } from '../../components/shared/team-row/team-row.component';
import { Team } from '../../models/team.model';


import { TeamService } from '../../services/team.service';
import { WorkerService } from '../../services/worker.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, TeamRowComponent, SearchBar, RouterLink], // Dodany SearchBar
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent implements OnInit {

  private teamService = inject(TeamService);
  private workerService = inject(WorkerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  filteredTeams: any[] = []; // Tablica na wyniki wyszukiwania  // TODO
  selectedTeam: any = null; // TODO

  teams = toSignal(
    this.authService.user$.pipe(
      tap(user => console.log('auth user:', user)), // TODO debug
      switchMap(user => user
        ? this.teamService.getTeamsByManager(user.uid)
        : EMPTY
      ),
      tap(teams => console.log('teams from API:', teams)) // TODO debug
    ),
    { initialValue: [] }
  );

  ngOnInit() {
    this.teamService.getTeams().subscribe(teams => {
      // this.teams = workers;
      this.filteredTeams = teams;

      console.log('teams: ', this.filteredTeams); // TODO debug
    });

  }

  isTeamOk(team: Team): Observable<boolean> {
    if (!team.id) return of(false);
    return this.workerService.getWorkersByTeam(team.id).pipe(
      map(workers =>
        workers.length > 0 &&
        workers.every(w => w.statusOk)
      )
    );
  }

  openTeam(team: any) {
    this.router.navigate(['/teams', team.id]);
  }

  onSearch(query: string) {
    const term = query.toLowerCase().trim();
    if (!term) {
      this.filteredTeams = this.teams();
      return;
    }

    this.filteredTeams = this.teams().filter(team =>
      team.name.toLowerCase().includes(term) ||
      team.description?.toLowerCase().includes(term)
    );
  }

}

/*
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkerRowComponent } from '../../components/shared/worker-row/worker-row.component';
import { SearchBar } from '../../components/ui/search-bar/search-bar';
import { DataService } from '../../services/data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, WorkerRowComponent, SearchBar, RouterLink], // Dodany SearchBar
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})

export class TeamsComponent implements OnInit {
  teams: any[] = [];
  workers: any[] = [];
  teamsWithWorkers: any[] = [];

  filteredWorkers: any[] = []; // Tablica na wyniki wyszukiwania  // TODO
  selectedWorker: any = null; // TODO

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // load teams
    this.dataService.getTeams().subscribe(teams => {
      this.teams = teams;

      // load workers
      this.dataService.getWorkers().subscribe(workers => {
        this.workers = workers;

        this.combineData();
      });
    });
  }

  combineData() {
    this.teamsWithWorkers = this.teams.map(team => ({
      ...team,
      workers: this.workers.filter(w => w.team_id === team.id)
    }));
  }

  getWorkerCount(team: any): number {
    return team.workers?.length || 0;
  }

  // ----- TODO
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
}
*/
