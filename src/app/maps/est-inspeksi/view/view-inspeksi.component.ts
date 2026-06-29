import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { EstInspeksiService } from 'src/app/shared/services/est_inspeksi';

import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
declare var $: any;
@Component({
  moduleId: module.id,
  selector: 'view-inspeksi-cmp',
  templateUrl: 'view-inspeksi.component.html',
  styleUrls: ['./view-inspeksi.component.css']
})

export class ViewInspeksiComponent implements OnInit, AfterViewInit {
  dbName;
  pathName;
  PATH_URL;
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'YYYY-MM-DD',

    containerClass: 'theme-dark-blue'
  };
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  hari_id;
  inspeksi;
  dataSelectStatus: { id: string; text: string; }[];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private estInspeksiService: EstInspeksiService,
    private authenticationService: AuthenticationService,

  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;
    let toDate: Date = new Date();
    let time: Date = new Date();
    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate),
      catatan: new FormControl('', []),
      waktu: new FormControl('', []),
      status: new FormControl('0', []),

    });

  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {
    let date: Date = new Date();
    let strDate = formatDate(date, "yyyy-MM-dd", "en_US");
    let tanggal = new Date(Date.parse(this.inspeksi['tanggal']));
    // this.entryForm.get('tanggal').patchValue(tanggal);
    this.entryForm.get('waktu').patchValue(this.inspeksi['tanggal'] + ' ' + this.inspeksi['jam']);
    this.entryForm.get('catatan').patchValue(this.inspeksi['catatan']);



  }

  public options: any;

  private loadSelect2(): void {
    this.dataSelectStatus = [
      { id: '0', text: 'OPEN' },
      { id: '1', text: 'CLOSE' },

    ];

    let selectedStatus;
    let s = this.inspeksi['status'] == '' ? '0' : this.inspeksi['status'];
    this.dataSelectStatus.forEach(el => {
      if (el.id == s) {
        selectedStatus = el;

      }

    });
    this.entryForm.get('status').patchValue(selectedStatus);
    this.entryForm.get('waktu').patchValue(this.inspeksi['tanggal'] + ' ' + this.inspeksi['jam']);
    this.entryForm.get('catatan').patchValue(this.inspeksi['catatan']);

  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    // let frmData = new FormData();
    // frmData.append('tanggal', formatDate(this.entryForm.get('tanggal').value, "yyy-MM-dd", "en_US"));
    // frmData.append('catatan', this.entryForm.get('catatan').value);
    // frmData.append('status', this.entryForm.get('status').value['id']);
    let catatan = this.entryForm.get('catatan').value;
    let status = this.entryForm.get('status').value['id'];
    this.estInspeksiService.updateStatus(this.inspeksi.id, catatan, status).subscribe(data => {
      console.log(data);
      if (data['status'] == 'OK') {
        console.log('ok');
        this.event.emit('OK');
        this.bsModalRef.hide();
      }
    });
  }

  upload(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.entryForm.patchValue({
      img: file
    });
    this.entryForm.get('img').updateValueAndValidity()
    console.log(file);
  }
  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {
    this.loadSelect2();

  }
  valueChange(event) {

  }
}
