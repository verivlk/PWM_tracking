import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { TeamDetailComponent } from './pages/team/team.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { authGuard } from './auth.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'teams', component: TeamsComponent, canActivate: [authGuard] },
  { path: 'team/:id', component: TeamDetailComponent, canActivate: [authGuard] },
  { path: 'team', component: TeamDetailComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'map', component: MapPageComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
