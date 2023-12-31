import { Component, ViewChild } from '@angular/core';
import { AddEditContactComponent } from '../add-edit-contact/add-edit-contact.component';
import { ContactService } from 'src/app/services/contact.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { ContactData, ContactList } from 'src/app/models/contact.model';
import { Select, Store } from '@ngxs/store';
import { contactState } from 'src/app/store/state/contact.state';
import { Observable, Subject,takeUntil } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  contactData:ContactData | undefined;
  contactList: ContactList[] = [];
  userDetail: any;
  modelTitle: string = "Add";
  searchTerm:string = '';
  pageSize:number = 5;
  pagginationNumber:number[] = [];
  currentPage:number = 1;
  totalPages:number = 1;
  noImage: string ='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Image_not_available.png/800px-Image_not_available.png';
  @ViewChild(AddEditContactComponent) addEditComponent: AddEditContactComponent | undefined
  @Select(contactState.getContacts) getcontacts$: Observable<ContactList> | undefined;
  destroy$ = new Subject();
  
  constructor(
    private contactService: ContactService,
    private userService: UserService,
    private store: Store
  ) {}

  ngOnInit() {
    this.userDetail = this.userService.getUserDetail();
    this.loadData();
  }

  loadData(start?:number) {
    this.store.select(contactState.getPaginatedItems).pipe(takeUntil(this.destroy$)).subscribe((filter)=>{
      let data = filter(this.userDetail.id, this.pageSize, start ? start : 1, this.searchTerm);
      this.contactList = data.contact;
      this.pagginationNumber = data.paggger;
      this.totalPages = this.pagginationNumber.length;
    });
  }

  saveChanges(type: string) {
    if (this.addEditComponent?.contactForm.valid) {
      if (type === "Edit") {
        this.contactService.editContact(this.userDetail.id,this.addEditComponent?.contactForm.value, this.addEditComponent?.imageSrc)
      } else {
        this.contactService.addContact(this.addEditComponent?.contactForm.value, this.addEditComponent?.imageSrc, this.userDetail.id);
      }
      this.loadData();
      this.closeModal();
      this.addEditComponent?.contactForm.reset();
    } else {
      this.addEditComponent?.contactForm.markAllAsTouched()
    }
  }

  removeContact(conatct: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this Contact!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.contactService.removeContact(conatct.id);
        this.loadData();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your Conatct is safe :)',
          'error'
        )
      }
    })
  }

  //Model
  openModal(data?: any) {
    const modalDiv = document.getElementById('add-edit-model');
    const mainPage = document.getElementById('main-page');
    if (modalDiv != null) {
      modalDiv.style.display = 'block';
      if (mainPage != null) {
        mainPage.style.opacity = '0.5';
      }
    }
    if (data) {
      this.addEditComponent?.contactForm.controls['id'].setValue(data.id);
      this.addEditComponent?.contactForm.controls['name'].setValue(data.name);
      this.addEditComponent?.contactForm.controls['email'].setValue(data.email);
      this.addEditComponent?.contactForm.controls['number'].setValue(data.number);
    }
     else {
      this.addEditComponent?.contactForm.controls['id'].setValue(0);
    }
    this.modelTitle = data ? "Edit" : "Add";
  }

  closeModal() {
    const modalDiv = document.getElementById('add-edit-model');
    const mainPage = document.getElementById('main-page');
    if (modalDiv != null) {
      modalDiv.style.display = 'none';
      if (mainPage != null) {
        mainPage.style.opacity = '1';
      }
    }
    this.addEditComponent?.clearForm();
  }

  //Search
  search(){
    this.currentPage = 1;
    this.contactService.loadContactData();
  }

  searchClear(){
    this.searchTerm = "";
    this.contactService.loadContactData();
  }
  
  //Paggination
  onSelectPageSize($event: any){
    this.pageSize = $event.target.value;
    this.currentPage = 1;
    this.loadData();
  }

  getPage(page: number){
    if(page > 0 && page <= this.totalPages){
      this.currentPage = page;
      this.loadData(page);
    } 
  }

  ngOnDestroy() {
    this.destroy$.complete();
  }
}
