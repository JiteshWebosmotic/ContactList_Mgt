import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/models/contact.model';
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
  destroy$ = new Subject();
  
  constructor(
    private userService: UserService,
    private store: Store
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(start?: number) {
    this.store.select(userState.getPaginatedItems).pipe(takeUntil(this.destroy$)).subscribe((filter)=>{
      let data = filter(this.pageSize, start ? start : 1, this.searchTerm);
      this.userList = data.userList;
      this.pagginationNumber = data.paggger;
      this.totalPages = this.pagginationNumber.length;
    });
  }

  //Search
  search(){
    this.currentPage = 1;
    this.userService.loadUserData();
  }

  searchClear(){
    this.searchTerm = "";
    this.userService.loadUserData();
  }

  //Paggination
  onSelectPageSize($event: any) {
    this.pageSize = $event.target.value;
    this.currentPage = 1;
    this.loadData();
  }

  getPage(page: number) {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData(page);
    }
  }

  ngOnDestroy() {
    this.destroy$.complete();
  }
}
