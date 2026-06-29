import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";
declare var swal: any;
import { AccKasbank } from 'src/app/shared/models/acc_kasbank.model';
import { formatDate } from '@angular/common';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { SERVER_API_URL, SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';
import { AccApInvoiceService } from 'src/app/shared/services/acc_ap_invoice.service';

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
  accApInvoice: any;

  type: any;
  selectedFile: File;
  selectedType: string;
  pathName;
  PATH_URL;
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private accKasbankService: AccKasbankService,
    private accApInvoiceService: AccApInvoiceService,

    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    this.entryForm = this.builder.group({
      // no_accKasbank: new FormControl(null, Validators.required),
      // no_referensi: new FormControl(null, Validators.required),
      // catatan: new FormControl('', ),
      file: new FormControl(null, []),
    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {

    // this.entryForm.controls['no_accKasbank'].patchValue(this.accKasbank.no_accKasbank);
    // this.entryForm.controls['no_referensi'].patchValue(this.accKasbank.no_referensi);
    // this.entryForm.controls['catatan'].patchValue(this.accKasbank.catatan);

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

    // frmData.append('no_accKasbank', this.entryForm.get('no_accKasbank').value);
    // frmData.append('no_referensi', this.entryForm.get('no_referensi').value);
    // frmData.append('catatan', this.entryForm.get('catatan').value);

    frmData.append("userfile", this.entryForm.get('file').value);

    this.accApInvoiceService.upload(this.accApInvoice.id, frmData).subscribe(data => {
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

  // updatePhoto() {
  //   let frmData = new FormData();
  //   frmData.append("userfile", this.entryForm.get('img').value);
  //   this.accKasbankService.updatePhoto(this.accKasbank.id, frmData).subscribe(data => {
  //     console.log(data);
  //     if (data['status'] == 'OK') {
  //       console.log('ok');
  //       this.event.emit('OK');
  //       this.bsModalRef.hide();
  //     }
  //   });

  // }
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

  onFileChange(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;
    this.selectedType = type;

    this.uploadNow();
  }

  uploadNow() {

    const formData = new FormData();
    formData.append('userfile', this.selectedFile);
    formData.append('tipe_file', this.selectedType);

    this.accApInvoiceService.upload(this.accApInvoice.id, formData)
      .subscribe((res: any) => {

        if (res.status === 'OK') {

          swal({
            title: 'Berhasil',
            text: 'File berhasil diupload',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });

          // 🔥 refresh data
          this.reloadData();
        }

      });
  }

  deleteFile(type: string) {

    swal({
      title: 'Yakin?',
      text: 'File akan dihapus!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya'
    }).then(() => {

      this.accApInvoiceService.deleteFile(this.accApInvoice.id, {
        tipe_file: type
      }).subscribe(() => {

        swal('Berhasil', 'File dihapus', 'success');

        this.reloadData();
      });

    });
  }

  preview(type: string) {

    let fileName = '';

    if (type === 'INVOICE') {
      fileName = this.accApInvoice.upload_invoice;
    }

    if (type === 'FAKTUR') {
      fileName = this.accApInvoice.upload_faktur;
    }

    if (!fileName) return;

    this.accApInvoiceService.openFile(this.accApInvoice.id, type, fileName);
  }

  reloadData() {
    this.accApInvoiceService.getById(this.accApInvoice.id)
      .subscribe(res => {
        this.accApInvoice = res['data'];
      });
  }

}
