import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
declare var swal: any;
import { InvPenerimaanPo } from 'src/app/shared/models/inv_penerimaan_po.model';
import { formatDate } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { PrcPpService } from 'src/app/shared/services/prc_pp.service';

@Component({
  moduleId: module.id,
  selector: 'upload-cmp',
  templateUrl: 'upload.component.html',
  styleUrls: ['upload.component.css'],
})

export class UploadComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  PrcPp: any;

 type:any;
 pathName;
 PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPpService: PrcPpService,

    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      // no_invPenerimaanPo: new FormControl(null, Validators.required),
      // no_referensi: new FormControl(null, Validators.required),
      // catatan: new FormControl('', ),
      file: new FormControl(null, []),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

  }
  private loadSelect2(): void {

  }


  onSubmit() {
    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }
    let frmData = new FormData();

    // frmData.append('no_invPenerimaanPo', this.entryForm.get('no_invPenerimaanPo').value);
    // frmData.append('no_referensi', this.entryForm.get('no_referensi').value);
    // frmData.append('catatan', this.entryForm.get('catatan').value);

    frmData.append("userfile", this.entryForm.get('file').value);

    this.PrcPpService.upload(this.PrcPp.id, frmData).subscribe(data => {
     console.log(data)
      if (data['status'] == 'OK') {
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
          type: 'success',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

 
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

    this.loadSelect2();

  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      file: file
    });
    this.entryForm.get('file').updateValueAndValidity();
    this.isChangePhoto = true;
    console.log(this.entryForm);
  }

}
