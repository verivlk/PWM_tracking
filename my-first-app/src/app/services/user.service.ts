import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData, setDoc, updateDoc } from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, switchMap, from } from 'rxjs';

import { AppUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // get Firestore profile for logged user
  userProfile$: Observable<AppUser | null> = authState(this.auth).pipe(
    switchMap(user => {
      if (!user) return of(null);

      const ref = doc(this.firestore, `users/${user.uid}`);
      return docData(ref, { idField: 'id' }) as Observable<AppUser>;
    })
  );

  // update preferences (dark mode, etc.)
  updatePreferences(data: Partial<AppUser>): Observable<void> {
    const user = this.auth.currentUser;

    if (!user) {
      throw new Error('No user logged in');
    }

    const ref = doc(this.firestore, `users/${user.uid}`);
    return from(setDoc(ref, data, { merge: true }));
  }

/*  // TODO
  // create user profile after first login
  syncUserFromAuth(): Observable<void> {
    return new Observable(sub => {
      this.auth.onAuthStateChanged(async user => {
        if (!user) {
          sub.next();
          sub.complete();
          return;
        }

        const ref = doc(this.firestore, `users/${user.uid}`);

        await setDoc(ref, {
          id: user.uid,
          name: user.displayName || '',
          darkMode: false,
          role: 'manager'
        }, { merge: true });

        sub.next();
        sub.complete();
      });
    });
  }
*/

}
