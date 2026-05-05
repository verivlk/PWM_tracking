import { Injectable, inject } from '@angular/core';
import {
  Auth, user as authUser, updateEmail, updatePassword,
  signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup,
  createUserWithEmailAndPassword, // Added for registration
  User as FirebaseUser
} from '@angular/fire/auth';
import { browserSessionPersistence, setPersistence, EmailAuthProvider, reauthenticateWithCredential} from 'firebase/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore'; // Added to save profile data

import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private auth = inject(Auth);
  private firestore = inject(Firestore); // Injected Firestore

  // Firebase auth user (login state)
  user$ = authUser(this.auth);

  constructor() { // keep session after refresh
    setPersistence(this.auth, browserSessionPersistence)
      .catch(err => console.error('Auth persistence error: ', err));
  }

  // --- NEW: Sprint 4 Registration Flow ---
  async registerNewSupervisor(email: string, pass: string, name: string, surname: string, imageFile: File): Promise<void> {
    try {
      // 1. Create the user credentials in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
      const user = userCredential.user;

      // 2. Convert the image file to a Base64 string
      const base64Image = await this.convertFileToBase64(imageFile);

      // 3. Save the extra profile data to Firestore
      // We use the Auth UID as the document ID so they are perfectly linked
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, {
        email: user.email,
        name: name,
        surname: surname,
        profileImage: base64Image,
        role: 'manager', // Kept consistent with your AppUser model
        darkMode: false, // Default setting
        createdAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Registration failed:', error);
      throw error; // Re-throw so the UI can catch and display it
    }
  }

  // Helper method to convert the image file to a string we can save in the database
  private convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
  // ---------------------------------------

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

  reauthenticate(password: string): Observable<void> {
    const user = this.auth.currentUser;

    if (!user || !user.email) {
      throw new Error('No authenticated user');
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      password
    );

    return from(
      reauthenticateWithCredential(user, credential)
        .then(() => undefined)
    );
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

  mapAuthError(err: any): string {
    switch (err.code) {
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Current password is incorrect';
      case 'auth/requires-recent-login':
        return 'Please re-login and try again';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      default:
        return err.message || 'Unexpected error';
    }
  }

}
