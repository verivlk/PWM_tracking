import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapViewComponent } from '../../components/ui/map-view/map-view.component';
import { WorkerRowComponent } from '../../components/shared/worker-row/worker-row.component';
import { SearchBar } from '../../components/ui/search-bar/search-bar'; // Import search bara
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MapViewComponent, WorkerRowComponent, SearchBar], // Dodany SearchBar
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  teams: any[] = [];
  filteredTeams: any[] = []; // Tablica na przefiltrowane wyniki

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getTeams().subscribe(data => {
      this.teams = data;
      this.filteredTeams = data; // Na start pokazujemy wszystko
    });
  }

  // Funkcja obsługująca wpisywanie w wyszukiwarkę
  onSearch(query: string) {
    const term = query.toLowerCase().trim();
    
    if (!term) {
      this.filteredTeams = this.teams;
      return;
    }

    this.filteredTeams = this.teams.filter(team => 
      team.name.toLowerCase().includes(term) || 
      team.project?.toLowerCase().includes(term) ||
      team.members?.some((m: any) => m.name.toLowerCase().includes(term))
    );
  }
}