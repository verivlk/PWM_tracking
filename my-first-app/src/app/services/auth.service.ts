import { Injectable } from '@angular/core';
import { Auth, user, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, browserSessionPersistence, setPersistence, User } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Observable to track if a user is logged in or out
  user$: Observable<User | null>;

  constructor(private firebaseAuth: Auth) {
    // Ensure the session persists across page reloads
    setPersistence(this.firebaseAuth, browserSessionPersistence);

    // Listen to the auth state
    this.user$ = user(this.firebaseAuth);
  }

  // Standard Entry: Email & Password
  login(email: string, pass: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAuth, email, pass).then(() => undefined);
    return from(promise);
  }

  // Log Out (Exit)
  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
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
      const result = await signInWithPopup(this.firebaseAuth, provider);
      if (!result.user) {
        throw new Error('No user data returned');
      }
    } catch (error) {
      console.error('VIP Entry Denied:', error);
      throw error;
    }
  }
}
