import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Dla SPRINTU 3 pobieramy z lokalnego JSON, w SPRINT 4 zmienisz to na Firebase
  private dataUrl = 'assets/data.json'; 

  constructor(private http: HttpClient) {}

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.dataUrl);
  }
}
