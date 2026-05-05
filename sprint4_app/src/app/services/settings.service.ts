import { Injectable, inject } from '@angular/core';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Auth, updateEmail, updatePassword } from '@angular/fire/auth';
import { from, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  updateUserPreferences(data: any): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) return throwError(() => new Error('Utente non autenticato'));

    const userDocRef = doc(this.firestore, `users/${user.uid}`);
    return from(updateDoc(userDocRef, data));
  }

  updateAccountEmail(newEmail: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) return throwError(() => new Error('Utente non autenticato'));

    return from(updateEmail(user, newEmail));
  }


  updateAccountPassword(newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) return throwError(() => new Error('Utente non autenticato'));

    return from(updatePassword(user, newPassword));
  }
}
