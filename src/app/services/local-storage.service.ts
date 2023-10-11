import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { ContactData } from './model-service.service';


@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private contactData: ContactData;

  constructor() {
    this.contactData = {
      user: [{ id: '1', name: 'demo', email: 'demo@1.com', password: 'demo1' }],
      contactList: [{ userId: '1', id: '1', name: 'demo', email: 'demo@11.com', number: 243, image: '' }]
    }
  }

  loadLocalStorageData() {
    let storedArray = localStorage.getItem("contactData");
    if (storedArray) {
      this.contactData = JSON.parse(storedArray);
    }
    return this.contactData;
  }

  setLocalStorageData(contactData:any) {
    localStorage.setItem("contactData", JSON.stringify(contactData));
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

  encryptCookieData(massage: string) {
    return CryptoJS.AES.encrypt(massage, 'secret key 123').toString();
  }

  decryptCookieData(ciphertext: string) {
    var bytes = CryptoJS.AES.decrypt(ciphertext, 'secret key 123');
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
