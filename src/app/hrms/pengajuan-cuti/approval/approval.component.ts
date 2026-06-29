import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
declare var swal: any;
import { BsModalRef } from 'ngx-bootstrap/modal';

import * as $ from "jquery";

import { HrmsPengajuanCuti } from 'src/app/shared/models/hrms_pengajuan_cuti.model';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { formatDate } from '@angular/common';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { SERVER_PATH_URL } from 'src/app/app.constants';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
import { HrmsApprovallSettingPengajuanCutiService } from 'src/app/shared/services/hrms_approvall_setting_pengajuan_cuti.service';


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
  HrmsPengajuanCuti: HrmsPengajuanCuti;
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
    private HrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private hrmsApprovallSettingPengajuanCutiService: HrmsApprovallSettingPengajuanCutiService,
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

    // this.entryForm.controls['no_po'].patchValue(this.HrmsPengajuanCuti.no_po);
    // this.entryForm.controls['catatan'].patchValue(this.HrmsPengajuanCuti.catatan);

    this.entryForm.get('tanggal').patchValue(new Date(Date.parse(this.HrmsPengajuanCuti.tanggal)));

    // this.HrmsPengajuanCutiService.getPdfSlip(this.HrmsPengajuanCuti.id).subscribe(
    //   (res) => {
    //     // console.log(res);
    //     var fileURL = URL.createObjectURL(res);
    //     document.querySelector("iframe").src = fileURL;

    //   }
    // );
  }
  public options: any;


  private loadSelect2(): void {


    this.hrmsApprovallSettingPengajuanCutiService.getKaryawanByLokasiAndKode(this.HrmsPengajuanCuti.sub_bagian_id, "PC1").subscribe(p => {
      this.dataSelectKaryawan = [];
      console.log(p)
      p['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama + "(" + d.nip + ") - "+d.lokasi });
      });
    });

  }


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

    this.HrmsPengajuanCutiService.approve(this.HrmsPengajuanCuti.id, frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log(data);
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

    // console.log(this.HrmsPengajuanCuti);
    // this.entryForm = this.builder.group({
    //   nip: new FormControl(this.HrmsPengajuanCuti.nip,[Validators.required]),
    //   nama: new FormControl(this.HrmsPengajuanCuti.nama, [Validators.required]),
    //   jenis_kelamin: new FormControl(this.HrmsPengajuanCuti.jenis_kelamin, [Validators.required]),
    //   tgl_lahir:   new FormControl(new Date(Date.parse(this.HrmsPengajuanCuti.tgl_lahir)), Validators.required),
    //   tempat_lahir: new FormControl(this.HrmsPengajuanCuti.tempat_lahir, []),
    //   alamat: new FormControl(this.HrmsPengajuanCuti.alamat, []),
    //   username: new FormControl(this.HrmsPengajuanCuti.username, []),
    //   password: new FormControl(this.HrmsPengajuanCuti.password, []),
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
