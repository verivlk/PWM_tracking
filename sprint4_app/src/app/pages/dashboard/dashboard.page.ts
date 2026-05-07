import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EMPTY, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';

import { WorkerRowComponent } from '../../components/shared/worker-row/worker-row.component';
import { WorkerService } from '../../services/worker.service';
import { AuthService } from '../../services/auth.service';
import { Worker } from '../../models/worker.model';

// 1. ADD THIS IMPORT FOR THE ICONS
import { addIcons } from 'ionicons';
import { mapOutline, peopleOutline, star } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule, WorkerRowComponent],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss']
})
export class DashboardPage implements OnInit {

  private workerService = inject(WorkerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  favoriteIds: string[] = [];

  workers = toSignal(
    this.authService.user$.pipe(
      switchMap(user => user
        ? this.workerService.getActiveWorkersByManager(user.uid)
        : EMPTY
      )
    ),
    { initialValue: [] }
  );

  filteredWorkers = signal<Worker[]>([]);

  constructor() {
    // 2. REGISTER THE ICONS HERE
    addIcons({ mapOutline, peopleOutline, star });

    effect(() => {
      const workers = this.workers();
      if (!workers.length) return;

      const sorted = [...workers].sort((a, b) => {
        return Number(a.statusOk) - Number(b.statusOk);
      });

      this.filteredWorkers.set(sorted);
    }, { allowSignalWrites: true });
  }

  // ... (keep your ngOnInit, onSearch, openWorker, and isFavorite methods exactly as they are below this) ...

  ngOnInit() {

    // Placeholder: We will load SQLite favorite IDs here later
  }

  // Adapted to take the native Ionic searchbar event
  onSearch(event: any) {
    const term = event.target.value?.toLowerCase().trim() || '';
    const workers = this.workers();

    if (!term) {
      this.filteredWorkers.set(workers);
      return;
    }

    this.filteredWorkers.set(
      workers.filter(worker =>
        worker.name.toLowerCase().includes(term) ||
        (worker.role && worker.role.toLowerCase().includes(term)) ||
        (worker.email && worker.email.toLowerCase().includes(term))
      )
    );
  }

  openWorker(worker: Worker) {
    // Navigate to the detail screen (Screen 4) using the worker ID
    this.router.navigate(['/worker-detail', worker.id]);
  }

  // Sprint 4 Rubric: Check if the worker is a favorite
  isFavorite(workerId?: string): boolean {
    if (!workerId) return false;
    return this.favoriteIds.includes(workerId);
  }
}
