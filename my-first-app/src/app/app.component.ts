// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // <-- Added Router
import { CommonModule } from '@angular/common';
import { DataService } from './services/data.service';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { AuthService } from './services/auth.service'; // <-- Added AuthService

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isDarkMode = false;

  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService); // Inject the Auth Service
  private router = inject(Router);           // Inject the Router

  // Expose the observable directly to the template
  user$ = this.authService.user$;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (localStorage.getItem('darkMode') === 'enabled') {
      this.isDarkMode = true;
    }
  }

  logout() {
    // Call the auth service to log out of Firebase, then redirect
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  // ... (Keep your testFirebaseConnection() method exactly as it is here) ...
  async testFirebaseConnection() { /* ... */ }
}
