import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(private coockieservice: CookieService,){}

    isAuthenticatedUser(): boolean {
        return  this.coockieservice.get("ConatctApp") ? true : false;
    }
}
