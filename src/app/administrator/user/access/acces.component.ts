import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { UserAccessService } from 'src/app/shared/services/userAccess.service';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'access-cmp',
  templateUrl: 'access.component.html',
  styleUrls: ['access.component.css'],
})

export class AccessComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  user: User;
  public dataSelect: any[] = [];
  public dataSelectAgama: any[] = [];
  public dataSelectKaryawan: any[] = [];
  dbName;
  pathName;
  PATH_URL;
  menuData: any;
  menuDataSubmit: any = [];
  selectedMenu: any[];
  dataSelectUserCopy: any[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userService: UserService,
    private karyawanService: KaryawanService,
    private authenticationService: AuthenticationService,
    private userAccesService: UserAccessService
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      user_full_name: new FormControl(null, Validators.required),
      user_name: new FormControl('', Validators.required),
      user_copy: new FormControl([], ),
      // user_email: new FormControl('', []),

      // user_password: new FormControl('', []),
      // re_password: new FormControl('', []),
      // employee_id: new FormControl([], []),
      // status: new FormControl('1', Validators.required),
      // img: new FormControl(null, []),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.userService.getAll().subscribe(u => {
      this.dataSelectUserCopy = [];
     u.forEach(d => {
        this.dataSelectUserCopy.push({ "id": d.id, "text": d.user_full_name });
      });
    });
    // console.log(this.user);
    this.entryForm.controls['user_full_name'].patchValue(this.user.user_full_name);
    this.entryForm.controls['user_name'].patchValue(this.user.user_name);
    //  this.entryForm.controls['user_email'].patchValue(this.user.user_email);
    //  this.entryForm.controls['status'].patchValue(this.user.status);
    this.getAccessMenu(this.user.id);
  }
  getAccessMenu(user_id){
    this.userAccesService.getMenuAccess(user_id).subscribe(d => {
      this.menuData = d['data'];
      console.log(this.menuData);
      this.selectedMenu = [];
      this.menuData.forEach(element => {
        if (element['selected'] == "0") {
          element['selected'] = false
        } else {
          element['selected'] = true
        }
        if (element['new_'] == "0") {
          element['new_'] = false
        } else {
          element['new_'] = true
        }
        if (element['edit_'] == "0") {
          element['edit_'] = false
        } else {
          element['edit_'] = true
        }
        if (element['delete_'] == "0") {
          element['delete_'] = false
        } else {
          element['delete_'] = true
        }
        if (element['print_'] == "0") {
          element['print_'] = false
        } else {
          element['print_'] = true
        }
        if (element['posting_'] == "0") {
          element['posting_'] = false
        } else {
          element['posting_'] = true
        }

        this.getSelected(element['children']);

      });

    });


  }
  copyAccess(){
  let user_id=  this.entryForm.controls['user_copy'].value['id']
  this.getAccessMenu(user_id);
  }
  changeSelected() {
    // console.log(this.menuData);
  }
  private loadSelect2(): void {
    let selectKaryawan: any;
    this.karyawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
        if (d.id == this.user.employee_id) {
          selectKaryawan = { "id": d.id, "text": d.nama };
        }

      });
      // console.log(selectKaryawan);
      this.entryForm.controls['employee_id'].patchValue(selectKaryawan);
    });
  }
  getSelected(data: any) {

    data.forEach(element => {
      if (element['selected'] == "0") {
        element['selected'] = false
      } else {
        element['selected'] = true
      }
      if (element['new_'] == "0") {
        element['new_'] = false
      } else {
        element['new_'] = true
      }
      if (element['edit_'] == "0") {
        element['edit_'] = false
      } else {
        element['edit_'] = true
      }
      if (element['delete_'] == "0") {
        element['delete_'] = false
      } else {
        element['delete_'] = true
      }
      if (element['print_'] == "0") {
        element['print_'] = false
      } else {
        element['print_'] = true
      }
      if (element['posting_'] == "0") {
        element['posting_'] = false
      } else {
        element['posting_'] = true
      }

      if (element['children']) {
        this.getSelected(element['children']);

      }

    });

  }

  pushToArray(nestedJson) {
    nestedJson.forEach(element => {
      if (element['selected']==true) {
        this.menuDataSubmit.push(element);
        this.pushToArray(element['children']);
      }
    });

  }
  onSubmit() {
    this.menuDataSubmit=[];
    this.menuData.forEach(element => {
      if (element['selected']==true) {
        this.menuDataSubmit.push(element);
        this.pushToArray(element['children']);
      }

    });
    let dataSubmit=[];
    dataSubmit=this.menuDataSubmit.map(d=>{
        let m={id:d.id,new_:d.new_,edit_:d.edit_,delete_:d.delete_,print_:d.print_,posting_:d.posting_};
        return m;
    })
    //  console.log(this.menuDataSubmit);
    //  console.log(dataSubmit);

    // console.log(this.entryForm.invalid);
    // this.isFormSubmitted = true;
    // if (this.entryForm.invalid) {
    //   return;
    // }


    this.userAccesService.save(this.user.id, dataSubmit).subscribe(data => {
      // console.log(data);
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {


  }
  valueChange($event) {
    // console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity();
    // this.isChangePhoto = true;
    // console.log(this.isChangePhoto);
  }
}
