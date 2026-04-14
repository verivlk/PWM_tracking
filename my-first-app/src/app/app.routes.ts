// import { Routes } from '@angular/router';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
// import { MapComponent } from './pages/map/map.component';
// import { TeamComponent } from './pages/team/team.component';
// import { SettingsComponent } from './pages/settings/settings.component';
// import { LoginComponent } from './pages/login/login.component';
// // AuthGuard można dodać później, aby chronić ścieżki przed niezalogowanymi użytkownikami

// export const routes: Routes = [
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'map', component: MapComponent },
//   { path: 'team', component: TeamComponent },
//   { path: 'settings', component: SettingsComponent },
//   { path: 'login', component: LoginComponent },
//   { path: '**', redirectTo: '/dashboard' } // fallback
// ];

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TeamComponent } from './pages/team/team.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'team', component: TeamComponent },
  // Tymczasowo przekierowujemy brakujące strony na dashboard (jeśli go zrobisz) lub team
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' } 
];