import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { formatDate } from '@angular/common';

import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

declare var swal: any;
@Component({
  moduleId: module.id,
  selector: 'viewer-cmp',
  templateUrl: 'viewer.component.html',
  styleUrls: ['viewer.component.css'],
})

export class ViewerComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();

  data: any;


  dbName;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private authenticationService: AuthenticationService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({

      lokasi_id: new FormControl([], []),
    });






  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }

  private loadSelect2(): void {


  }
  onSubmit() {
    console.log(this.entryForm.invalid);
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let arr_kelas = [];
    arr_kelas = this.entryForm.get('lokasi_id').value;
    let lokasi_id = arr_kelas.map(a => { return a.id });
    // frmData.append('tugas_kelas', JSON.stringify(kelas_id));
    let dataSubmit: any = {

      'lokasi_id': lokasi_id,


    };
    console.log(dataSubmit);


  }

  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {




  }
  valueChange($event) {
    console.log($event);


  }

}
