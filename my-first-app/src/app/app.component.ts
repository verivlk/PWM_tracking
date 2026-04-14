import { Component, OnInit } from '@angular/core';
// Zmiana tutaj:
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  // I zmiana tutaj:
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  isDarkMode = false;
  isLoggedIn = false; // To docelowo podepniesz pod Firebase/AuthService
  username = '';

  ngOnInit() {
    // Prosta logika trybu nocnego zachowana z Twojego starego JS
    if (localStorage.getItem('darkMode') === 'enabled') {
      this.isDarkMode = true;
    }
  }

  logout() {
    // Logika wylogowania
    this.isLoggedIn = false;
    sessionStorage.removeItem('currentUser');
  }
}