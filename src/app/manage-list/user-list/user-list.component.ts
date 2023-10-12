import { Component } from '@angular/core';
import { ContactService } from 'src/app/services/contact.service';
import { User } from 'src/app/services/model-service.service';
import { UserService } from 'src/app/services/user.service';

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
  constructor(
    private contactService: ContactService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.loadData();
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
}
