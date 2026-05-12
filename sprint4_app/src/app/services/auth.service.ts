import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword,  signOut } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) { }

  // Funzione per la Registrazione
  async register(userData: any) {
    try {
      // 1. Creazione dell'utente in Firebase Authentication con email e password
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        userData.email,
        userData.password
      );

      const uid = userCredential.user.uid;

      // 2. Salvataggio delle informazioni aggiuntive del profilo nel database Firebase
      // Creiamo un documento nella collezione 'users' usando l'UID dell'utente
      const userDocRef = doc(this.firestore, `users/${uid}`);

      const userProfile: User = {
        uid: uid,
        email: userData.email,
        name: userData.name,
        surname: userData.surname,
        profileImageUrl: userData.profileImageUrl
      };

      await setDoc(userDocRef, userProfile);

      return userCredential.user;
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      throw error;
    }
  }

  // Funzione per il Login
  async login(email: string, password: string) {
    try {
      // Autenticazione dell'utente già registrato contro il servizio Firebase Auth
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Errore durante il login:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
  async logout() {
    try {
      await signOut(this.auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Errore durante il logout:', error);
    }
  }
}
