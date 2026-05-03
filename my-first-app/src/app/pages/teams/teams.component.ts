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
