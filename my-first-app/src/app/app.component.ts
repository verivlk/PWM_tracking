import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  isLoggedIn = false;
  username = 'Admin';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (localStorage.getItem('darkMode') === 'enabled') {
      this.isDarkMode = true;
    }

    // BEZPIECZNE WYWOŁANIE: Czekamy chwilę na gotowość Firebase
    setTimeout(() => {
      // Możesz to odkomentować RAZ, żeby wgrać dane do nowej bazy
      // this.dataService.runFullImport();
    }, 1000);
  }

  logout() {
    this.isLoggedIn = false;
    sessionStorage.removeItem('currentUser');
  }
}