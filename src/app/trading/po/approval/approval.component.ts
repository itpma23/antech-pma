import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
declare var swal: any;
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { PrcPo } from 'src/app/shared/models/prc_po.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcPoService } from 'src/app/shared/services/prc_po.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
import { PrcApprovallSettingPoService } from 'src/app/shared/services/prc_approvall_setting_po.service';
import { TradingPoService } from 'src/app/shared/services/trading_po.service';


@Component({
  moduleId: module.id,
  selector: 'pp-approval-cmp',
  styleUrls: ['approval.component.css'],
  templateUrl: 'approval.component.html'
})

export class ApprovalComponent implements OnInit, AfterViewInit {
  isFormSubmitted = false;
  isChangePhoto = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }
  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();
  PrcPo: PrcPo;
  dbName;
  pathName;
  PATH_URL;

  dataSelectTanki;
  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;
  dataSelectItem;

  dataItem;

  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private PrcPoService: TradingPoService,
    private prcApprovallSettingService: PrcApprovallSettingPoService,
    private authenticationService: AuthenticationService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
    private InvItemService: InvItemService,
  ) {
    this.dbName = this.authenticationService.getUserDB();
    this.pathName = this.authenticationService.getUserPath();
    this.PATH_URL = SERVER_PATH_URL;

    let toDate: Date = new Date();

    this.entryForm = this.builder.group({
      karyawan_id: new FormControl([], Validators.required),
      lokasi_id: new FormControl([]),
      tanggal: new FormControl(toDate, Validators.required),
      no_po: new FormControl(''),
      catatan: new FormControl(''),

      details: this.builder.array([]),

    });




  }
  get userControl() { return this.entryForm.controls; }

  ngAfterViewInit(): void {

    this.entryForm.controls['no_po'].patchValue(this.PrcPo.no_po);
    this.entryForm.controls['catatan'].patchValue(this.PrcPo.catatan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.PrcPo.tanggal)));

    this.PrcPoService.getPdfSlip(this.PrcPo.id).subscribe(
      (res) => {
        // console.log(res);
        var fileURL = URL.createObjectURL(res);
        document.querySelector("iframe").src = fileURL;

      }
    );
  }
  public options: any;


  private loadSelect2(): void {


    this.prcApprovallSettingService.getKaryawanByLokasiAndKode(this.PrcPo.lokasi_id, "PO1",this.PrcPo.grand_total).subscribe(p => {
      this.dataSelectKaryawan = [];
      console.log(p)
      p['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + "(" + d.nama + ")" });

      });
    });

  }

  g
  onSubmit() {
    console.log(this.entryForm);

    this.isFormSubmitted = true;
    // let frmData=new FormData();
    if (this.entryForm.invalid) {
      return;
    }


    let frmData = this.entryForm.value;
    frmData['status'] = '';
    frmData['note_approve'] = '';
    frmData['is_finish'] = 0;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    console.log(frmData);

    this.PrcPoService.approve(this.PrcPo.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Data berhasil diSimpan',
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
    this.loadSelect2();

    // console.log(this.PrcPo);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.PrcPo.nip,[Validators.required]),
    //   nama: new FormControl(this.PrcPo.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.PrcPo.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.PrcPo.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.PrcPo.tempat_lahir, []),
    //   alamat: new FormControl(this.PrcPo.alamat, []),
    //   username: new FormControl(this.PrcPo.username, []),
    //   password: new FormControl(this.PrcPo.password, []),
    // });


  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }

  getUOM(form) {
    this.dataItem.forEach(x => {
      if (x.id == form.get('item').value.id) {
        form.get('uom').patchValue(x.uom);
      }
    });
  }
}
