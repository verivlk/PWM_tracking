/*
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, from, of } from 'rxjs';
import { environment } from '../../environments/environment';

// Firebase imports
import {
  Firestore,
  collection,
  collectionData,
  doc,
  docData,
  setDoc,
  addDoc,
  query // <-- Dodaj ten import
} from '@angular/fire/firestore';

import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private dataUrl = 'assets/data.json';

  private firestore = inject(Firestore, { optional: true });
  private auth = inject(Auth, { optional: true });

  // --- PRACOWNICY ---
  // ... w DataService

// --- PRACOWNICY ---
getWorkers(): Observable<any[]> {
  if (environment.useFirebase && this.firestore) {
    const ref = collection(this.firestore, 'workers');
    const q = query(ref); // <--- Tworzymy jawny obiekt Query
    return collectionData(q, { idField: 'id' }); // <--- Przekazujemy Query
  }
  return this.http.get<any>(this.dataUrl).pipe(map(d => d.workers || []));
}

// --- DRUŻYNY ---
getTeams(): Observable<any[]> {
  if (environment.useFirebase && this.firestore) {
    const ref = collection(this.firestore, 'teams');
    const q = query(ref); // <--- Tworzymy jawny obiekt Query
    return collectionData(q, { idField: 'id' }); // <--- Przekazujemy Query
  }
  return this.http.get<any>(this.dataUrl).pipe(map(d => d.teams || []));
}

// --- USTAWIENIA ---
  getSettings(): Observable<any[]> {
    // Rimuoviamo il blocco if(environment.useFirebase) per la UI.
    // La STRUTTURA della UI (quali campi mostrare nel form) viene letta
    // sempre e solo dal file locale assets/data.json
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => this.mapJsonToSettings(data.pages.settings))
    );
  }

// --- URZĄDZENIA LOKALIZACYJNE ---
getLocalizationDevices(): Observable<any[]> {
  if (environment.useFirebase && this.firestore) {
    const ref = collection(this.firestore, 'localization_devices');
    return collectionData(ref, { idField: 'id' });
  }
  // Fallback dla lokalnego JSON, jeśli potrzebny
  return of([]);
}

getWorkerById(workerId: string): Observable<any> {
  if (this.firestore) {
    const ref = doc(this.firestore, 'workers', workerId);
    return docData(ref, { idField: 'id' });
  }
  return of(null);
}

// ... reszta serwisu


  login(email: string, pass: string) {
    if (environment.useFirebase && this.auth) {
      return from(signInWithEmailAndPassword(this.auth, email, pass));
    }
    return of({ user: { email, role: 'admin' } });
  }

  private mapJsonToSettings(settings: any): any[] {
    return Object.entries(settings).map(([key, items]: [string, any]) => ({
      title: key.toUpperCase(),
      items: items.map((item: any) => ({
        ...item,
        id: Math.random(),
        type: key === 'appearance' ? 'toggle' : 'button'
      }))
    }));
  }

  // Tę metodę możesz już zostawić w spokoju, skoro dane są w bazie
  async runFullImport() {
    if (!this.firestore) return;
    console.log('Dane już są w bazie, nie musisz odpalać ponownie.');
  }
}
*/
