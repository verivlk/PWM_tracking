import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TeamDetailComponent } from './pages/team/team.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
// DODAJ TEN IMPORT (sprawdź czy ścieżka się zgadza z Twoją strukturą):
import { MapPageComponent } from './pages/map-page/map-page.component'; 
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'team', component: TeamDetailComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'map', component: MapPageComponent }, // Teraz zadziała
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];