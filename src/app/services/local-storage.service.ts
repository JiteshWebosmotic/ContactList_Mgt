import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ContactData, ContactList, User } from '../models/contact.model';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private contactData: ContactData;

  constructor() {
    this.contactData = { user: [], contactList: []}
  }

  loadLocalStorageData() {
    let storedArray = localStorage.getItem("contactData");
    if (storedArray) {
      this.contactData = JSON.parse(storedArray);
    }
    return this.contactData;
  }

  setContactList(contactList:ContactList[]){
    localStorage.setItem("contactData", JSON.stringify({...this.contactData,contactList: contactList}));
  }

  setUserList(userList: User[]){
    localStorage.setItem("contactData", JSON.stringify({...this.contactData, user: userList}));
  }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  encryptCookieData(id: string) {
    return CryptoJS.AES.encrypt(id, 'secret key 123').toString();
  }

  decryptCookieData(ciphertext: string) {
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
