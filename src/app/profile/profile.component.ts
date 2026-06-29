import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from '../shared/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { PengajarService } from 'src/app/shared/services/pengajar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { User } from 'src/app/shared/models/user.model';
declare var swal: any;
declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'profile-cmp',
  templateUrl: 'profile.component.html'
})

export class ProfileComponent implements OnInit {
  // profile: User = new User;
  profile: any;
  private apiUrl = SERVER_API_URL;
  data: any;
  pass: any = "*********"
  status: any;
  user: User;

  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;

  bsModalRef: BsModalRef;
  dbName;
  pathName;
  PATH_URL;
  myProfile;
  password = '';
  ulang_password = '';
  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private builder: FormBuilder,
    private userService: UserService,
    private karyawanService: KaryawanService,) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    // this.entryForm = this.builder.group({
    //   user_full_name: new FormControl(null, Validators.required),
    //   user_name: new FormControl('',Validators.required),
    //   jenis_kelamin: new FormControl('',Validators.required),

    //   status: new FormControl('1', Validators.required),
    // });

  }

  private loadSelect2(): void {

    let selectKaryawan: any;
    this.userService.getUserProfileLogin().subscribe(x => {
      this.myProfile = x['data'];
      console.log(x)
    });
  }

  ngOnInit() {
    this.loadSelect2();
    // this.data = this.authenticationService.getUserProfile();

    // console.log("DATA " + this.data);
    // this.callProfile();


  }

  callProfile() {
    // this.pengajarService.getById(this.data["uniqid"]).subscribe(profileData => {
    //   this.profile = profileData["data"];
    //   this.status = this.profile.status_id == "1" ? "Aktif" : "Pending/Blocked";
    //   console.log(profileData);
    // });
    this.profile = this.data;
    console.log(this.authenticationService.getUserDB());
  }

  ngAfterViewInit(): void {

    // this.entryForm.controls['user_full_name'].patchValue(this.user.user_full_name);

  }
  ngOnDestroy(): void {

  }
  changePassword() {
    if (this.password =='' || this.ulang_password=='') {

      swal({
        title: 'Perhatian!',
        text: 'Password Tidak boleh Kosong!',
        type: 'error',
        confirmButtonClass: "btn btn-success",
        buttonsStyling: false
      })


    return;
  }
    if (this.password != this.ulang_password) {

        swal({
          title: 'Perhatian!',
          text: 'Password dan ulang password tidak sama!',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })


      return;
    }

    let dataSubmit: User = {
      'user_password': this.password,
    };


    this.userService.update_password_login( dataSubmit).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

      }
    });
  }

}
