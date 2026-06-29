import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsPengajuanCutiService } from 'src/app/shared/services/hrms_pengajuan_cuti.service';
import { HrmsJenisAbsensiService } from 'src/app/shared/services/hrms_jenis_absensi.service';
import { TranslateService } from '@ngx-translate/core';

import { HrmsPengajuanCuti } from 'src/app/shared/models/hrms_pengajuan_cuti.model';

import { LookupPpComponent } from '../lookup-pp/lookup-pp.component';
import { formatDate, formatNumber } from '@angular/common';
import { isNullOrUndefined, isNumber, isString } from 'util';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

declare var $: any;
declare var swal: any;

interface Tipe {
  value: string;
  viewValue: string;
}
@Component({
  moduleId: module.id,
  selector: 'add-cmp',
  templateUrl: 'add.component.html',
  styleUrls: ['add.component.css'],
})

export class AddComponent implements OnInit, AfterViewInit {
  editor_modules: any;
  isFormSubmitted = false;
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  entryForm: FormGroup;
  categories: any[] = [];
  event: EventEmitter<any> = new EventEmitter();

  dataSelectKaryawan;
  dataSelectJenisAbsensi;
  dataSelectLokasi;
  dataSelectItem;
  dataSelectSupplier;
  dataSelectSyaratBayar;
  dataSelectFranco;
  dataSelectQuotation;
  dataItem;
  dataSelectMataUang: any[];
  dataMatauang: any;
  dataSelectPeminta: any[];
  dataPeminta: any;
  dataSelectPenyetuju: any[];
  dataPenyetuju: any;
  dataSelectLokasiPP: any[];
  dataSelectReadyStok: { id: string; text: string; }[];
  dataSelectStatusStok: { id: string; text: string; }[];
  data_karyawan: any;
  isChangePhoto: boolean;


  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private bsModalRef1: BsModalRef,
    private bsModalService: BsModalService,
    private HrmsPengajuanCutiService: HrmsPengajuanCutiService,
    private translate: TranslateService,
    private KaryawanService: KaryawanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private HrmsJenisAbsensiService: HrmsJenisAbsensiService,
    private authenticationService: AuthenticationService,


  ) {
    this.data_karyawan = this.authenticationService.getUserProfile();
    console.log(this.data_karyawan)
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      tanggal: new FormControl(toDate,),
      dari_tanggal: new FormControl(toDate, Validators.required),
      sampai_tanggal: new FormControl(toDate, Validators.required),
      lokasi_id: new FormControl([]),
      karyawan_id: new FormControl([], Validators.required),
      cuti: new FormControl('', Validators.required),
      jenis_absensi_id: new FormControl([], Validators.required),
      file: new FormControl(null, []),

    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
    // this.addBlok();

  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');

    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.dataSelectKaryawan = [];
    this.KaryawanService.getAllAktif().subscribe(x => {
      this.dataSelectKaryawan = [];
      x['data'].forEach(x => { 
        this.dataSelectKaryawan.push({ "id": x.id, "text": x.nama + " - " + x.nip });
      })
     // let d = x['data'];
      
      //this.entryForm.get('karyawan_id').patchValue({ "id": d.id, "text": d.nama + " - " + d.nip });
    });

    this.HrmsJenisAbsensiService.getAll().subscribe(x => {
      this.dataSelectJenisAbsensi = [];
      x['data'].forEach(d => {
        this.dataSelectJenisAbsensi.push({ "id": d.id, "text": "(" + d.kode + ") " + d.keterangan });
      });
    });


  }
  get details(): FormArray {
    return this.entryForm.get('details') as FormArray;
  };

  onSubmit() {
    this.isFormSubmitted = true;
    // console.log(this.entryForm);
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    frmData['tanggal'] = formatDate(this.entryForm.get('tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['dari_tanggal'] = formatDate(this.entryForm.get('dari_tanggal').value, "yyyy-MM-dd", 'en_US');
    frmData['sampai_tanggal'] = formatDate(this.entryForm.get('sampai_tanggal').value, "yyyy-MM-dd", 'en_US');

    // let quotation_id;
    // if (!isNullOrUndefined(this.entryForm.controls['quotation_id'].value)) {
    //   if (isNullOrUndefined(this.entryForm.controls['quotation_id'].value['id'])) {
    //     quotation_id = null
    //   } else {
    //     quotation_id = this.entryForm.controls['quotation_id'].value['id']
    //   }
    // } else {
    //   quotation_id = null
    // }
    // frmData['quotation_id'] = quotation_id;
    this.HrmsPengajuanCutiService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        let frmData = new FormData();
        frmData.append("userfile", this.entryForm.get('file').value);
        console.log(frmData)
        this.HrmsPengajuanCutiService.upload(data['data'], frmData).subscribe(data => {
         console.log(data)

        });
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
      } else {
        swal({
          title: 'Perhatian!',
          text: 'Proses Simpan Gagal',
          type: 'warning',
          confirmButtonClass: "btn btn-success",
          buttonsStyling: false
        })
        return;
      }
    });
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {

  }
  valueChange($event) {

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
  showNotification(from, align, message, color = 4) {
    var type = ['', 'info', 'success', 'warning', 'danger', 'rose', 'primary'];
    // console.log(type[color]);
    $.notify({
      icon: "notifications",
      message: message
    }, {
      type: type[color],
      timer: 3000,
      placement: {
        from: from,
        align: align
      }
    });
  }



}
