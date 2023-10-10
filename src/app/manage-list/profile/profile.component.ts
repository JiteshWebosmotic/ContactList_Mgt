import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  noImage: string ='https://media.tenor.com/XdFv1bbfOdEAAAAd/user-icons.gif';
  userDetail: any;
  constructor(
    private router: Router,
    private userService: UserService
  ){}

  ngOnInit() {
    this.userDetail = this.userService.getUserDetail();
  }

  back(){
    this.router.navigateByUrl('contacts');
  }

}
