import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ContactData, User } from './model-service.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  contactData: ContactData | any;
  userData = new BehaviorSubject<any>(null);
  paggerSize: number[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private coockieservice: CookieService,
  ) { }

  registerUser(data: any) {
    this.contactData = this.localStorageService.loadLocalStorageData();
    let available = this.contactData.user.find((u:User) => u.email === data.email)
    if (available) {
      return false;
    } else {
      let newId = this.localStorageService.create_UUID();
      this.contactData.user.push({ id: newId, name: data.fName, email: data.email, password: data.password, role: "USER" });
      this.localStorageService.setLocalStorageData(this.contactData);
      return true;
    }
  }

  loginUser(data: any) {
    this.contactData = this.localStorageService.loadLocalStorageData();
    let validEmail = this.contactData.user.find((u:User) => {
      if ((u.email === data.email) && (u.password === data.password)) {
        this.coockieservice.set("ConatctApp", this.localStorageService.encryptCookieData(u.id))
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

  getUserDetail(): User {
    let id = this.localStorageService.decryptCookieData(this.coockieservice.get("ConatctApp"));
    this.contactData = this.localStorageService.loadLocalStorageData();
    let userDetails = this.contactData.user.find((m: User) => m.id === id);
    this.userData.next(userDetails);
    return userDetails;
  }

  updateUserDetail(id: string, data: any) {
    this.contactData = this.localStorageService.loadLocalStorageData();
    let available = this.contactData.user.find((u:User) => (u.email === data.email && u.id != id))
    if (available) {
      return false;
    } else {
      this.contactData.user.map((m:User) => {
        if (m.id === id) {
          m.name = data.fName;
          m.email = data.email;
        }
      })
      this.localStorageService.setLocalStorageData(this.contactData);
      return true;
    }
  }

  getUsersList(pageSize: number, start: number, searchTerm?: string) {    
    //Get Data from the local storage
    this.contactData = this.localStorageService.loadLocalStorageData();

    //Load data in array
    if(searchTerm){
      this.contactData.user = this.contactData.user.filter((item: User) => (item.name.includes(searchTerm) || item.email.includes(searchTerm)));
    } else {
      this.contactData.user = this.contactData.user;
    } 

    //Load the pagger
    let perPage = Math.ceil(this.contactData.user.length/pageSize);
    this.paggerSize = new Array(perPage).fill(1).map((d,i)=>++i);

    //return the data according the page
    let endPage = pageSize * (start ? start : 1); 
    let startPage = endPage - pageSize;
    return this.contactData.user.slice(startPage,endPage);
  }
}
