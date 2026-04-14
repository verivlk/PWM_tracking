import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './team.component.html',
  styleUrls: []
})
export class TeamComponent implements OnInit {
  employees: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    // Wymaganie 1 & 2: Pobieranie danych z JSON za pomocą serwisu
    this.dataService.getEmployees().subscribe((data: any) => {
      // Dodajemy właściwość isOpen do sterowania akordeonem
      this.employees = data.map((emp: any) => ({ ...emp, isOpen: false }));
    });
  }

  toggleWorker(worker: any) {
    worker.isOpen = !worker.isOpen;
  }
}
