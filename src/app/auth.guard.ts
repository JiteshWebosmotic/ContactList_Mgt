import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route) => {
  let auth = inject(AuthService);
  let router = inject(Router);
  if (auth.isAuthenticatedUser()) {
    return true;
  } else {
    router.navigateByUrl('signIn');
    return false;
  }
};
