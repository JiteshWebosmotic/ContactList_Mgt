import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageListRoutingModule } from './manage-list-routing.module';
import { ShowListComponent } from './show-list/show-list.component';
import { AddEditContactComponent } from './add-edit-contact/add-edit-contact.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactHeaderComponent } from './contact-header/contact-header.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    ShowListComponent,
    AddEditContactComponent,
    ContactHeaderComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ManageListRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ManageListModule { }
