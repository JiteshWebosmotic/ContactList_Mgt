import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ContactData, ContactList } from '../models/contact.model';
import { addContact, editContact, getContact, removeContact } from '../store/action/contact.action';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactData: ContactData;
  paggerSize: number[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private store: Store
  ) {
    this.contactData = this.localStorageService.loadLocalStorageData();
  }

  getContectList(id: string, pageSize: number, start: number, searchTerm?: string) {
    //Get Data from the local storage
    this.contactData = this.localStorageService.loadLocalStorageData();

    //Load data in array
    if (searchTerm) {
      this.contactData.contactList = this.contactData.contactList.filter((item: ContactList) => item.userId === id && (item.name.includes(searchTerm) || item.email.includes(searchTerm)));
    } else {
      this.contactData.contactList = this.contactData.contactList.filter((m: ContactList) => m.userId === id);
    }

    //Load the pagger
    let perPage = Math.ceil(this.contactData.contactList.length / pageSize);
    this.paggerSize = new Array(perPage).fill(1).map((d, i) => ++i);

    //return the data according the page
    let endPage = pageSize * (start ? start : 1);
    let startPage = endPage - pageSize;
    return this.contactData.contactList.slice(startPage, endPage);
  }

  addContact(data: any, image: string, id: string) {
    //Get Data from the local storage
    this.contactData = this.localStorageService.loadLocalStorageData();

    //Check the availabity
    let available = this.contactData.contactList.find((con: ContactList) => con.email === data.email)
    if (available) {
      this.toastr.error('Failed to add conatct.', 'Email id is already in Used.');
    } else {
      this.contactData.contactList.forEach(m => m.userId === id);

      //Create new UUID
      let newId = this.localStorageService.create_UUID();
      let newContact = { userId: id, id: newId, name: data.name, number: data.number, email: data.email, image: image };
      this.contactData.contactList.push(newContact);
      this.store.dispatch(new addContact(newContact));

      //Save data in local storage
      this.localStorageService.setLocalStorageData(this.contactData);
      this.toastr.success('Contact added Successfull');
    }
  }

  editContact(data: any, image: string) {
    //Get Data from the local storage
    this.contactData = this.localStorageService.loadLocalStorageData();

    //Update the data
    this.contactData.contactList.map((m: ContactList) => {
      if (m.id === data.id) {
        m.name = data.name;
        m.number = data.number;
        m.image = image;
        m.email = data.email;
        this.store.dispatch(new editContact({ ...data, image: image }));

        //Save data in local storage
        this.localStorageService.setLocalStorageData(this.contactData);
        this.toastr.success('Contact updated Successfull');
      }
    });

  }

  removeContact(id: string) {

    //Get Data from the local storage
    this.contactData = this.localStorageService.loadLocalStorageData();

    //Remove specific contact 
    this.contactData.contactList = this.contactData.contactList.filter((item: ContactList) => item.id !== id)
    this.store.dispatch(new removeContact(id));

    //Save data in local storage
    this.localStorageService.setLocalStorageData(this.contactData);
    this.toastr.success('Contact removed Successfull');
  }

  loadContactData() {
    this.contactData = this.localStorageService.loadLocalStorageData();
    this.store.dispatch(new getContact(this.contactData.contactList));
  }
}
