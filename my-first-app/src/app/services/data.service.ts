import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, from, of } from 'rxjs';
import { environment } from '../../environments/environment';

// Firebase imports
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class DataService {
  private http = inject(HttpClient);
  private dataUrl = 'assets/data.json';

  // Wstrzykiwanie opcjonalne (nie wywali błędu gdy Firebase jest wyłączony w configu)
  private firestore = inject(Firestore, { optional: true });
  private auth = inject(Auth, { optional: true });

  // --- PRACOWNICY ---
  getWorkers(): Observable<any[]> {
    if (environment.useFirebase && this.firestore) {
      const ref = collection(this.firestore, 'workers');
      return collectionData(ref, { idField: 'id' });
    }
    return this.http.get<any>(this.dataUrl).pipe(map(d => d.workers || []));
  }

  // --- DRUŻYNY ---
  getTeams(): Observable<any[]> {
    if (environment.useFirebase && this.firestore) {
      const ref = collection(this.firestore, 'teams');
      return collectionData(ref, { idField: 'id' });
    }
    return this.http.get<any>(this.dataUrl).pipe(map(d => d.teams || []));
  }

  // --- USTAWIENIA ---
  getSettings(): Observable<any[]> {
    if (environment.useFirebase && this.firestore) {
      const ref = collection(this.firestore, 'settings');
      return collectionData(ref, { idField: 'id' }).pipe(
        map(docs => docs.map((doc: any) => ({
          title: doc.id.toUpperCase(),
          items: doc.items.map((item: any) => ({
            ...item,
            type: doc.id === 'appearance' ? 'toggle' : 'button'
          }))
        })))
      );
    }
    return this.http.get<any>(this.dataUrl).pipe(
      map(data => this.mapJsonToSettings(data.pages.settings))
    );
  }

  // --- LOGOWANIE ---
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
}