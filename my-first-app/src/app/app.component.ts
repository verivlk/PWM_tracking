// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router'; // <-- Added Router
import { CommonModule } from '@angular/common';

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

  private authService = inject(AuthService);
  private router = inject(Router);

  user$ = this.authService.user$;

  ngOnInit() {
    if (localStorage.getItem('darkMode') === 'enabled') {
      this.isDarkMode = true;
    }
    this.applyTheme();
  }

  private applyTheme() {
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  logout() {
    // Call the auth service to log out of Firebase, then redirect
    this.authService.logout().subscribe(() => {
      void this.router.navigate(['/login']);
    });
  }

}
