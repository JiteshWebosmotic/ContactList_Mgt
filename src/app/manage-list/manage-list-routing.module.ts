import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ProfileComponent } from './profile/profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { authGuard } from '../auth.guard';

const routes: Routes = [
  { path: 'contacts', component: ContactListComponent },
  { path: 'user', component: UserListComponent, canActivate:[authGuard] ,data: { role: ['ADMIN']}},
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo:'contacts', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class ManageListRoutingModule { }
