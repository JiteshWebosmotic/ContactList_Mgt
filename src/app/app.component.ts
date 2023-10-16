import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'testTask';
  
  constructor(
    private userService: UserService,
    private contactService: ContactService ){}

  ngOnInit(): void {
    this.userService.loadUserData();
    this.contactService.loadContactData();
  }
}
