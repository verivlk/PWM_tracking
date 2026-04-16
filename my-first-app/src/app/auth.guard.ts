// src/app/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    map((user) => {
      if (user) return true; // Access Granted [cite: 921]
      router.navigate(['/login']); // Access Denied [cite: 921]
      return false;
    })
  );
};
