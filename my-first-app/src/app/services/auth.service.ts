import { Injectable, inject } from '@angular/core';
import { Auth, user as authUser, updateEmail, updatePassword,
  signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup,
  browserSessionPersistence, setPersistence,
  User as FirebaseUser } from '@angular/fire/auth'; // user -> user() - function; User - object
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);

  // Firebase auth user (login state)
  user$ = authUser(this.auth);

  constructor() { // keep session after refresh
    setPersistence(this.auth, browserSessionPersistence)
      .catch(err => console.error('Auth persistence error: ', err));
  }

  // Standard Entry: Email & Password
  login(email: string, pass: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, pass).then(() => undefined);
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth).then(() => {
      // Clear any local session data
      sessionStorage.clear();
    });
    return from(promise);
  }

  // The VIP Pass: Social Login Integration
  async googleLogin(): Promise<void> {
    const provider = new GoogleAuthProvider();
    try {
      // Opens a popup window for the user
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error('VIP Entry Denied:', error);
      throw error;
    }
  }

  updateEmail(newEmail: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    return from(updateEmail(user, newEmail));
  }


  updatePassword(newPassword: string): Observable<void> {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }
    return from(updatePassword(user, newPassword));
  }


}
