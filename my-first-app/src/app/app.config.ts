import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

// Definiujemy tablicę providerów Firebase tylko jeśli flaga jest aktywna
const firebaseProviders = environment.useFirebase ? [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
] : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    // Rozpakowujemy tablicę tutaj - to naprawia błąd TS2345
    ...firebaseProviders 
  ]
};