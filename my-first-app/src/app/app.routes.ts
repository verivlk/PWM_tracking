import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { TeamDetailComponent } from './pages/team/team.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { SettingsComponent } from './pages/settings/settings.component';
import {WorkersComponent} from './pages/workers/workers.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'teams', component: TeamsComponent, canActivate: [authGuard] },
  { path: 'team/:teamId', component: TeamDetailComponent, canActivate: [authGuard] },
  { path: 'team', component: TeamDetailComponent, canActivate: [authGuard] },
  { path: 'workers', component: WorkersComponent, canActivate: [authGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'map', component: MapPageComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
