import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-worker-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './worker-row.component.html',
  styleUrls: ['./worker-row.component.css']
})
export class WorkerRowComponent {
  @Input() workerData: any; // Tu wpadną dane z pętli let person of workers
  @Input() isActive: boolean = false; // Dodaj to
}