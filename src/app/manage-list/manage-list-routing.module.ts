import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowListComponent } from './show-list/show-list.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: 'contacts', component: ShowListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo:'contacts', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule] 
})
export class ManageListRoutingModule { }
