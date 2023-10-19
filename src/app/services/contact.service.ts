import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { ToastrService } from 'ngx-toastr';
import { ContactData, ContactList } from '../models/contact.model';
import { addContact, editContact, loadContact, removeContact } from '../store/state/contact.state';
import { Store } from '@ngxs/store';
import { take } from 'rxjs';

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

  addContact(data: any, image: string, id: string) {
    let newId = this.localStorageService.create_UUID();
    let newContact = { userId: id, id: newId, name: data.name, number: data.number, email: data.email, image: image };
    this.store.dispatch(new addContact(newContact)).pipe(take(1)).subscribe((val)=>{
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
