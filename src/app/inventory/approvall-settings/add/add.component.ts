import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { PrcApprovallSettingService } from 'src/app/shared/services/prc_approvall_setting.service';
import { Pengajar } from 'src/app/shared/models/pengajar.model';
import { formatDate } from '@angular/common';
import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { TranslateService } from '@ngx-translate/core';
import { Akun } from 'src/app/shared/models/akun.model';
import { PrcApprovallSetting } from 'src/app/shared/models/prc_approvall_setting.model';
import { InvApprovalSettingPbService } from 'src/app/shared/services/inv_approvall_setting_pb.service';
import { HttpErrorResponse } from '@angular/common/http';

Quill.register('modules/imageResize', ImageResize);

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

  dataSelectTanki;
  dataSelectSimbol;
  dataSelectLokasi;
  dataSelectKode;
  dataSelectKaryawan;

  jenis_kelamin = '';
  tipes: Tipe[] = [
    { value: '0', viewValue: 'KAS' },
    { value: '1', viewValue: 'Bank' },
    { value: '2', viewValue: 'Piutang' }
  ];
  constructor(private builder: FormBuilder,
    private bsModalRef: BsModalRef,
    private InvApprovalSettingPbService: InvApprovalSettingPbService,
    private translate: TranslateService,
    private PksTankiService: PksTankiService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private KaryawanService: KaryawanService,
  ) {
    let toDate: Date = new Date();

    this.entryForm = this.builder.group({

      // tanggal: new FormControl(toDate, Validators.required),

      lokasi_id: new FormControl([], Validators.required),
      kode_id: new FormControl([], Validators.required),
      karyawan_id: new FormControl([], Validators.required),
      is_finish: new FormControl(0, Validators.required),



    });

  }
  get userControl() { return this.entryForm.controls; }
  ngAfterViewInit(): void {
    this.loadSelect2();
  }
  public dataSelect: any[] = [];
  public options: any;

  private loadSelect2(): void {
    let m = this.translate.instant('holidays.messages.update');



    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });

    this.KaryawanService.getAll().subscribe(x => {
      this.dataSelectKaryawan = [];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nip +' - '+ d.nama });
      });
    });

    this.dataSelectKode = [
      { id: 'PB1', text: 'PB1' },
      { id: 'PB2', text: 'PB2' },
      { id: 'PB3', text: 'PB3' },
      { id: 'PB4', text: 'PB4' }
    ];

  }
  onSubmit() {
    this.isFormSubmitted = true;
    if (this.entryForm.invalid) {
      return;
    }

    let frmData = this.entryForm.value;
    console.log(frmData);
    // frmData['tanggal']=formatDate( this.entryForm.get('tanggal').value,"yyyy-MM-dd",'en_US');

    this.InvApprovalSettingPbService.create(frmData).subscribe(
      data => {
        console.log(data);
        if (data['status'] === 'OK') {
          console.log('ok');
          swal({
            title: 'Info!',
            text: 'Simpan berhasil',
            type: 'success',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });

          this.event.emit('OK');
          this.bsModalRef.hide();
        } else {
          swal({
            title: 'Perhatian!',
            text: 'Proses Simpan Gagal',
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });
        }
      },
      (error: HttpErrorResponse) => {
        // Handle errors (bad request, server errors, etc.)
        if (error.status === 400) {
          // If error status is 400 (Bad Request)
          swal({
            title: 'Perhatian!',
            text: error.error.data || 'Proses Simpan Gagal', // Menampilkan pesan error dari server jika ada
            type: 'warning',
            confirmButtonClass: "btn btn-success",
            buttonsStyling: false
          });
        } else {
          // For other error statuses
          swal({
            title: 'Kesalahan!',
            text: 'Terjadi kesalahan pada server. Coba lagi nanti.',
            type: 'error',
            confirmButtonClass: "btn btn-danger",
            buttonsStyling: false
          });
        }
      }
    );
  }


  onClose() {
    this.bsModalRef.hide();
  }

  ngOnInit() {



  }
  valueChange($event) {
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
