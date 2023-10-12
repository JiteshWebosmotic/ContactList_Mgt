import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';


export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot) => {
  let auth = inject(AuthService);
  let router = inject(Router);

  let roles = route.data['role'];

  if (!auth.isAuthenticatedUser()) {
    router.navigateByUrl('signIn');
    return false;
  }

  if(roles){
    if(auth.hasRole(roles)){
      return true;
    }
    else{
      router.navigateByUrl('contacts');
      return false;
    } 
  }

  return true;
};

