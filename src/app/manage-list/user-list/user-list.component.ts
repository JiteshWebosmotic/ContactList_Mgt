import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { User } from 'src/app/models/contact.model';
import { ContactService } from 'src/app/services/contact.service';
import { UserService } from 'src/app/services/user.service';
import { userState } from 'src/app/store/state/user.state';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent {
  userList: User[] = [];
  searchTerm: string = '';
  pageSize: number = 5;
  pagginationNumber: number[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  @Select(userState.getUser) getuser$: Observable<User> | undefined;
  subscription: Subscription | undefined;
  
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subscription = this.getuser$?.subscribe((data:any)=>{
      this.userList = data;

      // ### get the state data. but still using local storage data for all show related oprtaions
      this.loadData();
    })
  }

  loadData(start?: number) {
    this.userList = this.userService.getUsersList(this.pageSize, start ? start : 1, this.searchTerm);
    this.pagginationNumber = this.userService.paggerSize;
    this.loadPaggination();
  }

  //Search
  search(){
    this.loadData();
    this.currentPage = 1;
  }

  searchClear(){
    this.searchTerm = "";
    this.loadData();
  }

  //Paggination
  onSelectPageSize($event: any) {
    this.pageSize = $event.target.value;
    this.loadData();
    this.currentPage = 1;
  }

  loadPaggination() {
    this.pagginationNumber = this.userService.paggerSize;
    this.totalPages = this.pagginationNumber.length;
  }

  getPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
