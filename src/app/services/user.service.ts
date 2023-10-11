import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ContactData, User } from './model-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  contactData: ContactData | undefined;
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private coockieservice: CookieService,
  ) { }

  registerUser(data: any) {
    this.contactData = this.localStorageService.loadLocalStorageData();
    let available = this.contactData.user.find(u => u.email === data.email)
    if (available) {
      return false;
    } else {
      let newId = this.localStorageService.create_UUID();
      this.contactData.user.push({ id: newId, name: data.fName, email: data.email, password: data.password });
      this.localStorageService.setLocalStorageData(this.contactData);
      return true;
    }
  }

  loginUser(data: any) {
    this.contactData = this.localStorageService.loadLocalStorageData();
    let validEmail = this.contactData.user.find(u => {
      if ((u.email === data.email) && (u.password === data.password)) {
        this.coockieservice.set("ConatctApp",this.localStorageService.encryptCookieData(u.email))
        return true;
      } else {
        return false;
      }
    });
    return validEmail;
  }

  logOut() {
    this.coockieservice.delete("ConatctApp");
    this.router.navigateByUrl('signIn');
  }

  getUserDetail(): User | undefined {
    let email = this.localStorageService.decryptCookieData(this.coockieservice.get("ConatctApp"));
    this.contactData = this.localStorageService.loadLocalStorageData();
    return this.contactData.user.find((m: User) => m.email === email);
  }

  updateUserDetail(data: any){
    this.contactData = this.localStorageService.loadLocalStorageData();
    this.contactData.user.map((m)=>{
      if(m.id === data.id){
        m.name = data.name;
        m.email = data.email;
      }
    })
    this.localStorageService.setLocalStorageData(this.contactData);
    this.coockieservice.set("ConatctApp",this.localStorageService.encryptCookieData(data.email))
  }
}
