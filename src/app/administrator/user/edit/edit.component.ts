import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserService } from 'src/app/shared/services/user.service';
import { User } from 'src/app/shared/models/user.model';
declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css'],
})

export class EditComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  event: EventEmitter<any>=new EventEmitter();
  user:User;
  public dataSelect: any[] = [];
  public dataSelectAgama: any[] = [];
  public dataSelectKaryawan: any[] = [];
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private userService:UserService,
    private karyawanService:KaryawanService,
    private authenticationService: AuthenticationService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      this.entryForm = this.builder.group({
        user_full_name: new FormControl(null, Validators.required),
        user_email: new FormControl('', []),
        user_name: new FormControl('',Validators.required),
        user_password: new FormControl('', []),
        re_password: new FormControl('', []),
        employee_id: new FormControl([], Validators.required),
        status: new FormControl('1', Validators.required),
        img: new FormControl(null, []),
      });






  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

     this.entryForm.controls['user_full_name'].patchValue(this.user.user_full_name);
     this.entryForm.controls['user_name'].patchValue(this.user.user_name);
     this.entryForm.controls['user_email'].patchValue(this.user.user_email);
     this.entryForm.controls['status'].patchValue(this.user.status);



  }

  private loadSelect2(): void {




    let selectKaryawan:any;
    this.karyawanService.getAll().subscribe(x=>{
      this.dataSelectKaryawan=[];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({"id":d.id,"text":d.nama});
        if (d.id==this.user.employee_id){
          selectKaryawan={"id":d.id,"text":d.nama};
        }

      });

      this.entryForm.controls['employee_id'].patchValue(selectKaryawan);

    });



  }
  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let employeeId;
    employeeId=(this.entryForm.get('employee_id').value['id']==null) ?null:this.entryForm.get('employee_id').value['id']

    let dataSubmit :User = {
      'user_full_name': this.entryForm.get('user_full_name').value,
      'user_name': this.entryForm.get('user_name').value,
      'user_password':this.entryForm.get('user_password').value,
      'user_email': this.entryForm.get('user_email').value,
      'status': this.entryForm.get('status').value,
      'employee_id':employeeId,


    };
     console.log(dataSubmit);

    this.userService.update(this.user.id,dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
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


  updatePhoto(){
    let frmData=new FormData();
    frmData.append("userfile", this.entryForm.get('img').value);
    this.userService.updatePhoto(this.user.id,frmData).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });

  }
  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event){
    console.log($event);

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
    this.isChangePhoto=true;
    console.log(this.isChangePhoto);
 }
}
