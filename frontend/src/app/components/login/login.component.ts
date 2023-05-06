import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/app/models/server-data-response';
import { AuthService } from 'src/app/app/services/auth.service';
import { WebService } from 'src/app/app/services/web.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  public loginInvalid!: boolean;
  private formSubmitAttempt: boolean | undefined;
  private returnUrl: string | undefined;
  public passwordValidation = {
    length: false,
    character: false,
    lowercase: false,
    uppercase: false,
    number: false
  }
  emailPattern = '';
  passwordPattern = '';
  constructor(
    private toastr: ToastrService,
    private WS: WebService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {

  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)
      ])
    });
  }
  public onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.loginForm.valid) {
      try {
        // const username = this.form.get('username').value;
        // const password = this.form.get('password').value;
        // await this.authService.login(username, password);
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  get loginValue(): void {
    return this.loginForm.value;
  }

  public login(): void {
    this.WS.post('api/master/user/login', { login: this.loginValue }).subscribe((res: IResponse) => {
      if (res.status === 1) {
        this.toastr.success(res.description);
        this.router.navigate(['/month-task'])
      } else if (res.status === 2) {
        this.toastr.info(res.description);
      } else {
        this.toastr.error(res.description);
      }
    });
  }

}

