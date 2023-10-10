import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  signInForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    if(this.authService.isAuthenticatedUser()){
      this.router.navigateByUrl("contacts");
    }
  }
  
  onSubmit() {
    let result = this.userService.loginUser(this.signInForm.value);
    if(result){
      this.toastr.success('Login successfully');
      this.router.navigateByUrl('contacts');
    } else {
      this.toastr.error('Login Failed', 'Incurrect Username or Password');
    }
  }
}
