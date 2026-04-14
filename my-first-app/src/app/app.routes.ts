import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TeamComponent } from './pages/team/team.component';
// DODAJ TEN IMPORT (sprawdź czy ścieżka się zgadza z Twoją strukturą):
import { MapPageComponent } from './pages/map-page/map-page.component'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'team', component: TeamComponent },
  { path: 'map', component: MapPageComponent }, // Teraz zadziała
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];