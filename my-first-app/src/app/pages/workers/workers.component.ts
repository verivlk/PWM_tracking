import {Component, inject, OnInit} from '@angular/core';
import {CommonModule, NgForOf} from "@angular/common";
import {SearchBar} from "../../components/ui/search-bar/search-bar";
import {TeamRowComponent} from "../../components/shared/team-row/team-row.component";
import {TeamService} from '../../services/team.service';
import {WorkerService} from '../../services/worker.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {toSignal} from '@angular/core/rxjs-interop';
import {EMPTY, map, Observable, of, switchMap, tap} from 'rxjs';
import {Team} from '../../models/team.model';
import {WorkerRowComponent} from '../../components/shared/worker-row/worker-row.component';
import {FormsModule} from '@angular/forms';
import {Worker} from '../../models/worker.model';

@Component({
  selector: 'app-workers',
  standalone: true,
  imports: [CommonModule, WorkerRowComponent, SearchBar, FormsModule],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.css'
})
export class WorkersComponent implements OnInit {
  private teamService = inject(TeamService);
  private workerService = inject(WorkerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  // workers: Worker[] = [];
  selectedWorker: Worker | null = null;

  workers = toSignal(
    this.authService.user$.pipe(
      tap(user => console.log('auth user:', user)), // TODO debug
      switchMap(user => user
        ? this.workerService.getWorkersByManager(user.uid)
        : EMPTY
      ),
      tap(workers => console.log('workers from API:', workers)) // TODO debug
    ),
    { initialValue: [] }
  );

  filteredWorkers: Worker[] = this.workers();


  ngOnInit() {}


  onSearch(query: string): void {
    const term = query.toLowerCase().trim();
    if (!term) {
      this.filteredWorkers = this.workers();
      return;
    }

    this.filteredWorkers = this.workers().filter(worker =>
      worker.name.toLowerCase().includes(term) ||
      worker.role?.toLowerCase().includes(term) ||
      worker.email?.toLowerCase().includes(term)
    );
  }


}
