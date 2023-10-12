import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { UserService } from './services/user.service';


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

export const roleguardGuard: CanActivateFn = (route, state) => {
  let user = inject(UserService);
  let router = inject(Router);
  let http = inject(HttpClient);
  
  let routeRolesUrl = 'assets/route-roles.json';
  let userDetail = user.getUserDetail();
  let routingURL = route.routeConfig?.path;
  let routingConfigData:any;

  return http.get(routeRolesUrl).pipe(map((data)=>{
    routingConfigData = data;
    let roleType = routingConfigData?.find((d:any)=> d.Route == routingURL);
    if (roleType.Role.includes(userDetail?.role)){
      return true;
    } else {
      router.navigateByUrl('contacts');
      return false;
    }
  }));
};
