import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        private coockieservice: CookieService,
        private userService: UserService
        ){}

    isAuthenticatedUser(): boolean {
        return  this.coockieservice.get("ConatctApp") ? true : false;
    }

    hasRole(expectedRoles: any): boolean {
        let roleType = this.userService.getUserDetail();
        return expectedRoles.includes(roleType.role);
    }
}
