import { Component, OnInit, EventEmitter, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

// import * as $ from "jquery";
import { PksTankiService } from 'src/app/shared/services/pks_tanki.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsApprovallSettingPengajuanCutiService } from 'src/app/shared/services/hrms_approvall_setting_pengajuan_cuti.service';
import { formatDate } from '@angular/common';
import { PrcApprovallSettingPo } from 'src/app/shared/models/prc_approvall_setting_po.model';
import { TranslateService } from '@ngx-translate/core';

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
    private hrmsApprovallSettingPengajuanCutiService: HrmsApprovallSettingPengajuanCutiService,
    private translate: TranslateService,
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
      // min_amount: new FormControl(0, Validators.required),
      // max_amount: new FormControl(0, Validators.required),



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



    this.GbmOrganisasiService.getAllByType("SUBBAGIAN").subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
    });
    this.KaryawanService.getAllAktif().subscribe(x => {
      this.dataSelectKaryawan = [];
      x['data'].forEach(d => {
        this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama +"("+ d.lokasi_tugas_nama+') - '+ d.sub_bagian_nama });
      });
    });
    // this.entryForm.controls['lokasi_id'].valueChanges.subscribe(x => {
    //   let isdSub = x.id;
    //   this.KaryawanService.getAllAktifByDivisi(isdSub, '2001-01-01').subscribe(x => {
    //     this.dataSelectKaryawan = [];
    //     x['data'].forEach(d => {
    //       this.dataSelectKaryawan.push({ "id": d.id, "text": d.nama });
    //     });
    //   });
    // })
    this.dataSelectKode = [
      { id: 'PC1', text: 'PC1' },
      { id: 'PC2', text: 'PC2' },
      { id: 'PC3', text: 'PC3' },
      { id: 'PC4', text: 'PC4' },
      { id: 'PC5', text: 'PC5' },
      { id: 'PC6', text: 'PC6' },
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

    this.hrmsApprovallSettingPengajuanCutiService.create(frmData).subscribe(data => {
      if (data['status'] == 'OK') {
        console.log('ok');
        swal({
          title: 'Info!',
          text: 'Simpan berhasil',
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
    console.log($event);

    //  let selectedOptions = $event.target['options'];
    //  let selectedIndex = selectedOptions.selectedIndex;
    // this.jenis_kelamin = selectedOptions[selectedIndex].text;

  }
}
