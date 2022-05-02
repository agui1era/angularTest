import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AuthenticationService} from '@app/_services';
import {ErrorStateMatcher} from "@angular/material/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({templateUrl: 'login.component.html', styleUrls: ["login.component.sass"]})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  matcher = new MyErrorStateMatcher();
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.userValue) {
      this.router.navigate(['/']);
    }
  }

  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.min(3)
  ]);

  ngOnInit() {
    this.dialog.closeAll()
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,/*
        Validators.email,*/
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.min(3)
      ])
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          const returnUrl = '/';
          location.reload()
          //this.router.navigateByUrl(returnUrl);
        },
        error: error => {
          console.log(error);
          this.error = error;
          this.openSnackBar("error de credenciales")
          this.loading = false;
        }
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, "cerrar",
      {});
  }

}
