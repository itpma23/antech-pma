import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivationStart, Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';

import * as $ from "jquery";
import { first } from 'rxjs/operators';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'login-cmp',
  templateUrl: './login.component.html',
  styleUrls: ['login.component.css'],
})

export class LoginComponent implements OnInit {
  tgl: Date = new Date();
  loginForm: FormGroup;
  settings: any;
  isSettingsLoad: boolean;
    hidePassword = true;

        showPassword;

  backgroundImage: string;
  isFormSubmitted = false;
  returnUrl;

  @ViewChild(RouterOutlet, { static: true }) outlet: RouterOutlet;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,

  ) { }

  checkFullPageBackgroundImage() {
    var $page = $('.full-page');
    var image_src = $page.data('image');

    if (image_src !== undefined) {
      var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
      $page.append(image_container);
    }
  };
  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    console.log( this.route.snapshot.queryParams['returnUrl'])
    const userProf = this.authenticationService.getUserProfile();
    // console.log(userProf);
    if (userProf != null) {
      this.router.navigate([this.returnUrl]).then(()=>{
        //this.IsLoginProcess=false;
        return;
       }
      );
    }

    this.checkFullPageBackgroundImage();

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      $('.card').removeClass('card-hidden');
    }, 700);

    this.loadForm();
  }
  get userControl() { return this.loginForm.controls; }
  onSubmit() {

    this.isFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }


        this.authenticationService.login(this.userControl.email.value, this.userControl.password.value)
          .subscribe(
            data => {
              if (data['status'] == 'OK') {
                this.router.navigate([ this.returnUrl]);
              } else {
                swal({
                  title: 'Perhatian!',
                  text: data['message'],
                  type: 'warning',
                  confirmButtonClass: "btn btn-success",
                  buttonsStyling: false
                })

              }
            });



  }

  instantLogin(email, password) {
    this.loginForm.patchValue({ email: email });
    this.loginForm.patchValue({ password: password });
  }



  loadForm() {
    // let kodeSekolah=localStorage.getItem('kode_sekolah');
    this.loginForm = this.formBuilder.group({
      // kode_sekolah: [kodeSekolah, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]]
    });
  }
}
