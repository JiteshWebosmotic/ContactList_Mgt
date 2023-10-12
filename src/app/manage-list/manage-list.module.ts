import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageListRoutingModule } from './manage-list-routing.module';
import { ContactListComponent } from './contact-list/contact-list.component';
import { AddEditContactComponent } from './add-edit-contact/add-edit-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactHeaderComponent } from './contact-header/contact-header.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './user-list/user-list.component';


@NgModule({
  declarations: [
    AddEditContactComponent,
    ContactHeaderComponent,
    ProfileComponent,
    UserListComponent,
    ContactListComponent
  ],
  imports: [
    CommonModule,
    ManageListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ManageListModule { }
