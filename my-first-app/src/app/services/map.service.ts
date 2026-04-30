// services/map.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private activeWorkerIds = new BehaviorSubject<string[]>([]);
  activeWorkerIds$ = this.activeWorkerIds.asObservable();

  private focusCoords = new BehaviorSubject<{lat: number, lon: number}[] | null>(null);
  focusCoords$ = this.focusCoords.asObservable();

  setFocus(coords: {lat: number, lon: number}[], workerIds: string[] = []) {
    this.activeWorkerIds.next(workerIds);
    this.focusCoords.next(coords);
  }

  clearFocus() {
    this.activeWorkerIds.next([]);
    // this.focusCoords.next(null);
  }

  getActiveWorkerIds(): string[] {
    return this.activeWorkerIds.getValue();
  }
}