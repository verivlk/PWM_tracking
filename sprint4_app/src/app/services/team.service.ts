import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, addDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable, map, from } from 'rxjs'; // from makes Observable from Promise
import { Team } from '../models/team.model';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private firestore = inject(Firestore);

  private collectionName = 'teams';

  getTeams(): Observable<Team[]> {
    const ref = collection(this.firestore, this.collectionName);

    return collectionData(ref, { idField: 'id' }) as Observable<Team[]>;
  }

  getTeamById(teamId: string): Observable<Team> {
    const ref = doc(this.firestore, `${this.collectionName}/${teamId}`);

    return docData(ref, { idField: 'id' }) as Observable<Team>;
  }

  getTeamsByManager(managerId: string): Observable<Team[]> {
    return this.getTeams().pipe(
      map((teams: Team[]) =>
        teams.filter(t => t.managerId === managerId)
      )
    );
  }

  addTeam(team: Team) {
    const ref = collection(this.firestore, this.collectionName);
    return addDoc(ref, team);
  }

  updateTeam(teamId: string, data: Partial<Team>) {
    const ref = doc(this.firestore, `${this.collectionName}/${teamId}`);
    return updateDoc(ref, data);
  }

  deleteTeam(teamId: string) {
    const ref = doc(this.firestore, `${this.collectionName}/${teamId}`);
    return deleteDoc(ref);
  }

}
