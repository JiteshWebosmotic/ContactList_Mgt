import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  signUpForm = new FormGroup({
    fName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required)
  })
  passwordNotMatch: boolean = false;

  constructor(
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    if(this.authService.isAuthenticatedUser()){
      this.router.navigateByUrl("contactList");
    }
  }

  onSubmit() {
    if (!this.signUpForm.valid) {
      this.signUpForm.markAllAsTouched()
    } else {
      let o_Password = this.signUpForm.controls['password'].value ? this.signUpForm.controls['password'].value : '';
      let c_Password = this.signUpForm.controls['confirmPassword'].value ? this.signUpForm.controls['confirmPassword'].value : '';

      if (o_Password !== c_Password) {
        this.passwordNotMatch = true;
      } else {
        let result = this.userService.registerUser(this.signUpForm.value);
        if(result){
          this.toastr.success('Registration Successfull');
          this.router.navigateByUrl('signIn');
        } else {
          this.toastr.error('Registration Failed', 'Email id is already in Used.');
        }
      }
    }
  }

}
