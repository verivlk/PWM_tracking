import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; // Added IonicModule

@Component({
  selector: 'app-worker-row',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './worker-row.component.html',
  styleUrls: ['./worker-row.component.scss']
})
export class WorkerRowComponent {
  @Input() workerData: any;
  @Input() statusOk: boolean = false;
}
