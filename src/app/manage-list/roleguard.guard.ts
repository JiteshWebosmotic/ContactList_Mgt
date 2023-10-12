import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const roleguardGuard: CanActivateFn = (route, state) => {
  let user = inject(UserService);
  let router = inject(Router);
  let userDetail = user.getUserDetail();
  if (userDetail?.role === "ADMIN") {
    return true;
  } else {
    router.navigateByUrl('contacts');
    return false;
  }
};
