import { Component } from '@angular/core';
import { User } from 'src/app/services/model-service.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-header',
  templateUrl: './contact-header.component.html',
  styleUrls: ['./contact-header.component.scss']
})
export class ContactHeaderComponent {
  userDetail: User | undefined;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userDetail = this.userService.getUserDetail();
  }

  logOut() {
    Swal.fire({
      title: 'Are you sure want to Logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.userService.logOut();
      }
    })
  }
}
