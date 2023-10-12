import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-header',
  templateUrl: './contact-header.component.html',
  styleUrls: ['./contact-header.component.scss']
})
export class ContactHeaderComponent {
  userName: string = '';
  showUserMenu: boolean = false;
  subscription: Subscription | undefined;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.subscription = this.userService.userData.subscribe((data)=>{
      this.userName = data?.name;
      if(data?.role === "ADMIN"){
        this.showUserMenu = true;
      } else {
        this.showUserMenu = false;
      }
    });
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

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
