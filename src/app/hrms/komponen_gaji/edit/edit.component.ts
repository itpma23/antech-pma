import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
// import { BlogService } from 'src/app/services/blog.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { HrmsKomponenGaji } from 'src/app/shared/models/hrms_komponen_gaji.model';
import { HrmsKomponenGajiService } from 'src/app/shared/services/hrms_komponen_gaji.service';
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
  dataSelectKategori;
  event: EventEmitter<any>=new EventEmitter();
  komponenGaji:HrmsKomponenGaji;
  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private komponenGajiService: HrmsKomponenGajiService,
    private authenticationService: AuthenticationService,

    ) {
      this.dbName= this.authenticationService.getUserDB();
      this.pathName= this.authenticationService.getUserPath();
      this.PATH_URL=SERVER_PATH_URL;
      this.entryForm = this.builder.group({
        jenis: new FormControl(null, Validators.required),
        nama: new FormControl(null, Validators.required),
        urut: new FormControl([], Validators.required),


      });




  }
  get userControl() { return this.entryForm.controls; }
  private loadSelect2(): void {


  }
  ngAfterViewInit(): void {

     this.entryForm.controls['jenis'].patchValue(this.komponenGaji.jenis);
     this.entryForm.controls['nama'].patchValue(this.komponenGaji.nama);
     this.entryForm.controls['urut'].patchValue(this.komponenGaji.urut);


  }


  onSubmit(){
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let dataSubmit :HrmsKomponenGaji = {
      'jenis': this.entryForm.get('jenis').value,
      'nama': this.entryForm.get('nama').value,
      'urut': this.entryForm.get('urut').value

    };
     console.log(dataSubmit);

    this.komponenGajiService.update(this.komponenGaji.id,dataSubmit).subscribe(data=>{
      console.log(data);
      if( data['status']=='OK'){
        console.log('ok');
        swal({
          title: 'Save!',
          text: 'Data has been Saved successfully.',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
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
