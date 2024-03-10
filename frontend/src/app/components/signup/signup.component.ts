import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IResponse } from 'src/app/models/server-data-response';
import { AuthService } from 'src/app/services/auth.service';
import { WebService } from 'src/app/services/web.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  public singupForm!: FormGroup;
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
  constructor(
    @Inject(DOCUMENT) document: Document,
    private toastr: ToastrService,
    private WS: WebService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
  }
  ngOnInit() {
    this.singupForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,16})/)
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(/((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,16})/)
      ])
    });
  }

  get password(): any {
    return this.singupForm.get('password')?.value
  }

  get confirm(): any {
    return this.singupForm.get('confirmPassword')?.value
  }

  get singupValue(): any {
    return this.singupForm.value;
  }
  public validationForPassword(): void {
    const value = this.password

    if (value.length >= 8) {
      this.passwordValidation.length = true;
    }

    if (value.match(/[a-z]/)) {
      this.passwordValidation.lowercase = true;
    }

    if (value.match(/[A-Z]/)) {
      this.passwordValidation.uppercase = true;
    }

    if (value.match(/[0-9]/)) {
      this.passwordValidation.number = true;
    }

    if (value.match(/[!@#$%^&*]/)) {
      this.passwordValidation.character = true;
    }
  }

  public matchPassword(): void {
    if (this.password !== this.confirm) {
      this.toastr.info(`Password doesn't match`);
    }
  }

  public singup(): void {
    if (this.singupValue.email === '') {
      this.toastr.info('Enter an email');
      (document.getElementById('email') as HTMLElement).focus();
      return;
    }
    if (this.singupValue.password === '') {
      this.toastr.info('Enter Password');
      (document.getElementById('password') as HTMLElement).focus();
      return;
    }
    if (this.singupValue.confirmPassword === '') {
      this.toastr.info('Enter Confirm Password');
      (document.getElementById('confirmPassword') as HTMLElement).focus();
      return;
    }
    this.WS.post('api/master/user/signup', { signup: this.singupValue }).subscribe((res: IResponse) => {
      if (res.status === 1) {
        this.toastr.success(res.description);
        this.router.navigate(['/login']);
      } else if (res.status === 2) {
        this.toastr.info(res.description);
      } else {
        this.toastr.error(res.description);
      }
    });
  }
}
