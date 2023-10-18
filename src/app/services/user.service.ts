import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';
import { ContactData, User } from '../models/contact.model';
import { Store } from '@ngxs/store';
import { addUser, editUser, loadUsers } from '../store/action/user.action';

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
    private store: Store
  ) { }

  registerUser(data: any) {
    let newId = this.localStorageService.create_UUID();
    let newUser = { id: newId, name: data.fName, email: data.email, password: data.password, role: "USER" };
    let result = false;
    this.store.dispatch(new addUser(newUser)).subscribe((success)=>{
      result = true;
    },(err)=>{
      result = false;
    });
    return result;
  }

  loginUser(data: any) {
    this.contactData = this.localStorageService.loadLocalStorageData();
    let validEmail = this.contactData.user.find((u: User) => {
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
    let result = false;
    this.store.dispatch(new editUser({ id: id, ...data })).subscribe((success)=>{
      result = true;
    },(err)=>{
      result = false;
    });
    return result;
  }

  getUsersList(pageSize: number, start: number, searchTerm?: string) {
    //Get Data from the local storage
    this.contactData = this.localStorageService.loadLocalStorageData();

    //Load data in array
    if (searchTerm) {
      this.contactData.user = this.contactData.user.filter((item: User) => (item.name.includes(searchTerm) || item.email.includes(searchTerm)));
    } else {
      this.contactData.user = this.contactData.user;
    }

    //Load the pagger
    let perPage = Math.ceil(this.contactData.user.length / pageSize);
    this.paggerSize = new Array(perPage).fill(1).map((d, i) => ++i);

    //return the data according the page
    let endPage = pageSize * (start ? start : 1);
    let startPage = endPage - pageSize;
    return this.contactData.user.slice(startPage, endPage);
  }

  loadUserData() {
    this.contactData = this.localStorageService.loadLocalStorageData();
    this.store.dispatch(new loadUsers(this.contactData.user));
  }
}
