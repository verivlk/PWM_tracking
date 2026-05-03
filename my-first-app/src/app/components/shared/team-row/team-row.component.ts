import {Component, inject, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router} from '@angular/router';


@Component({
  selector: 'app-team-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team-row.component.html',
  styleUrls: ['./team-row.component.css']
})
export class TeamRowComponent {
  @Input() teamData: any;
  @Input() statusOk: boolean = false;

  private router = inject(Router);


  teamDetail() {
    if (!this.teamData?.id) return;
    this.router.navigate(['/team', this.teamData.id]);

  }
}
