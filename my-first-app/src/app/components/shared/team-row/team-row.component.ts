import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


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
}
