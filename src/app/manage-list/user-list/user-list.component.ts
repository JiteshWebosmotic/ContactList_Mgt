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
  userList:User[] = [];
  constructor(
    private contactService: ContactService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userList = this.userService.getUserList();
  }
}
