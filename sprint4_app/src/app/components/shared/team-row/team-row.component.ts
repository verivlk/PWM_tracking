import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-row',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './team-row.component.html',
  styleUrls: ['./team-row.component.scss']
})
export class TeamRowComponent {
  @Input() teamData: any;
  @Input() statusOk: boolean | null = false;
  @Input() active: boolean = false;

  private router = inject(Router);

  teamDetail(event: Event) {
    event.stopPropagation(); // Prevents parent clicks
    if (!this.teamData?.id) return;
    this.router.navigate(['/team', this.teamData.id]);
  }
}
