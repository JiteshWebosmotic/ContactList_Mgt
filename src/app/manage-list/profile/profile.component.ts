import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  noImage: string ='https://media.tenor.com/XdFv1bbfOdEAAAAd/user-icons.gif';
  userDetail: any;
  showEdit:boolean = false;
  userDetailForm = new FormGroup({
    fName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  })
  constructor(
    private userService: UserService,
    private toastr: ToastrService,
  ){}

  ngOnInit() {
    this.userDetail = this.userService.getUserDetail();
    this.userDetailForm.controls['fName'].setValue(this.userDetail.name);
    this.userDetailForm.controls['email'].setValue(this.userDetail.email);
  }

  edit(){
    this.showEdit = true;
  }

  save(){
    let result = this.userService.updateUserDetail(this.userDetail.id, this.userDetailForm.value);
    if(result){
      this.toastr.success('Profile updated Successfull');
      this.userDetail = this.userService.getUserDetail();
      this.showEdit = false;
    } else{
      this.toastr.error('Failed to update profile details', 'Email id is already in Used.');
    }
    
  }
}
