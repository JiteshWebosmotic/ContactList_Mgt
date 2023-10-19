import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ContactData, ContactList } from '../models/contact.model';
import { addContact, editContact, loadContact, removeContact } from '../store/action/contact.action';
import { Store } from '@ngxs/store';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contactData: ContactData | undefined;
  paggerSize: number[] = [];
  constructor(
    private localStorageService: LocalStorageService,
    private toastr: ToastrService,
    private store: Store
  ) {}

  getContectList(id: string, pageSize: number, start: number, searchTerm?: string) {
    //Get Data from the local storage

    // ####  use customize selector for get contact data directly from the state
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
    let newId = this.localStorageService.create_UUID();
    let newContact = { userId: id, id: newId, name: data.name, number: data.number, email: data.email, image: image };
    this.store.dispatch(new addContact(newContact)).subscribe((val)=>{
      this.toastr.success('Contact added Successfull');
    },(err)=>{
      this.toastr.error('Failed to add conatct.', err);
    });
  }

  editContact(id: string,data: any, image: string) {
    // ###### use email condition same as in add 
    this.store.dispatch(new editContact({userId: id, ...data, image: image }));
    this.toastr.success('Contact updated Successfull');
  }

  removeContact(id: string) {
    this.store.dispatch(new removeContact(id));
    this.toastr.success('Contact removed Successfull');
  }

  loadContactData() {
    this.contactData = this.localStorageService.loadLocalStorageData();
    this.store.dispatch(new loadContact(this.contactData.contactList));
  }
}
