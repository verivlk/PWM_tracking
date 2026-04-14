import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataService {
  private dataUrl = 'assets/data.json'; 

  constructor(private http: HttpClient) {}

  // Pobiera pracowników (dla strony Team)
  getWorkers(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.workers || [])
    );
  }

  // Pobiera drużyny (dla strony Dashboard)
  getTeams(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => data.teams || [])
    );
  }

  getSettings(): Observable<any[]> {
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => {
        const settings = data.pages.settings;
        // Mapujemy obiekt sekcji na tablicę, którą łatwo wyświetlić w *ngFor
        return Object.entries(settings).map(([key, items]: [string, any]) => ({
          title: key.toUpperCase(),
          // Dodajemy typ 'toggle' dla sekcji appearance, reszta to 'button'
          items: items.map((item: any) => ({
            ...item,
            id: Math.random(), // Proste ID do śledzenia aktywnego elementu
            type: key === 'appearance' ? 'toggle' : 'button'
          }))
        }));
      })
    );
  }
}