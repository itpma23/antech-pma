import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
import {  HrmsKomponenPerjalananService } from 'src/app/shared/services/hrms_komponen_perjalanan.service';
import { Akun } from 'src/app/shared/models/akun.model';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { HrmsKomponenPerjalanan } from 'src/app/shared/models/hrms_komponen_perjalanan.model';

declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'edit-cmp',
  styleUrls: ['edit.component.css'],
  templateUrl: 'edit.component.html'
})

export class EditComponent implements OnInit,AfterViewInit{
  isFormSubmitted=false;
  isChangePhoto=false;
	datepickerConfig = {
		dateInputFormat: 'DD-MM-YYYY',
		containerClass: 'theme-red'
	}
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any>=new EventEmitter();
  hrmsKomponenPerjalanan:HrmsKomponenPerjalanan
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private HrmsKomponenPerjalananService:HrmsKomponenPerjalananService,
    private authenticationService: AuthenticationService,
    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      this.entryForm = this.builder.group({

        nama: new FormControl(null, Validators.required),

      });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {


     this.entryForm.controls['nama'].patchValue(this.hrmsKomponenPerjalanan.nama);




  }


  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit :Akun = {

      'nama': this.entryForm.get('nama').value



    };
     console.log(dataSubmit);

    this.HrmsKomponenPerjalananService.update(this.hrmsKomponenPerjalanan.id,dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Data Berhasil Diubah!',
          // text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })

        this.event.emit('OK');
        this.bsModalRef.hide();
      }else{
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal' ,
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }


  onClose(){
    this.bsModalRef.hide();
  }

  ngOnInit() {

    // console.log(this.akun);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.akun.nip,[Validators.required]),
    //   nama: new FormControl(this.akun.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.akun.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.akun.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.akun.tempat_lahir, []),
    //   alamat: new FormControl(this.akun.alamat, []),
    //   username: new FormControl(this.akun.username, []),
    //   password: new FormControl(this.akun.password, []),
    // });


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
