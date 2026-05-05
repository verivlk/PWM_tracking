export interface AppUser {
  id?: string;  // Firebase auth uid; email is part of it
  name: string;
  role: 'admin' | 'manager';
  darkMode: boolean; // settings
}
