import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from "ngx-bootstrap/modal";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { SERVER_API_URL } from 'src/app/app.constants';

import { DataTableDirective } from 'angular-datatables';
import 'datatables.net';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { formatDate } from '@angular/common';
import { KaryawanService } from 'src/app/shared/services/karyawan.service';
import { HrmsAbsensiService } from 'src/app/shared/services/hrms_absensi.service';
import { HrmsLemburService } from 'src/app/shared/services/hrms_lembur.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';

import { saveAs } from 'file-saver';declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormKaryawanSubmitted = false;
  isFormAbsensiSubmitted = false;
  isFormLemburSubmitted = false;
  listKelas;
  dtOptions: any;
  private apiUrl = SERVER_API_URL;
  @ViewChild(DataTableDirective, { static: true })
  dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject();
  exportAsConfig: ExportAsConfig = {
    type: 'pdf',
    elementIdOrContent: 'mytable',
  };
  datepickerConfig = {
    dateInputFormat: 'DD-MM-YYYY',
    containerClass: 'theme-red'
  }

  absensiForm: FormGroup;
  karyawanForm: FormGroup;
  lemburForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKaryawanAbsensi;
  dataSelectKaryawanLembur;
  dataSelectBulan;
  dataSelectTahun;
  dataSelectLokasi;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataSelectSubBagian: any[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private absensiService: HrmsAbsensiService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private lemburService: HrmsLemburService,
    private karyawanService: KaryawanService,

    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.karyawanForm = this.builder.group({
      lokasi: new FormControl([], []),
      sub_bagian: new FormControl([], []),
      jenis: new FormControl('0', []),
      format_laporan: new FormControl('view', Validators.required),
      status: new FormControl('aktif', Validators.required),
    });


    this.absensiForm = this.builder.group({
      karyawanAbsensi: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });
    this.lemburForm = this.builder.group({
      karyawanLembur: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });

  }

  ngOnInit() {
    this.loadSelect2();

  }


  ngAfterViewInit(): void {

  }
  ngOnDestroy(): void {

  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'mapel').subscribe(() => { });
  }
  private loadSelect2(): void {
    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });
      });
      this.karyawanForm.controls['lokasi'].valueChanges.subscribe(x => {
        let org_id = x.id;
        this.gbmOrganisasiService.getAfdStByUnit(org_id).subscribe(x => {
          this.dataSelectSubBagian = [];
          x.forEach(d => {
            this.dataSelectSubBagian.push({ "id": d.id, "text": d.nama });
          });

        });

      });

    });
    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawanAbsensi=[];
    //   this.dataSelectKaryawanLembur=[];
    //  let  peng=x['data'];
    //   peng.forEach(d => {
    //     this.dataSelectKaryawanAbsensi.push({"id":d.id,"text":d.nama});
    //     this.dataSelectKaryawanLembur.push({"id":d.id,"text":d.nama});

    //   });

    // });

    this.dataSelectBulan = [
      { "id": "01", "text": "Januari" },
      { "id": "02", "text": "Februari" },
      { "id": "03", "text": "Maret" },
      { "id": "04", "text": "April" },
      { "id": "05", "text": "Mei" },
      { "id": "06", "text": "Juni" },
      { "id": "07", "text": "Juli" },
      { "id": "08", "text": "Agustus" },
      { "id": "09", "text": "September" },
      { "id": "10", "text": "Oktober" },
      { "id": "11", "text": "November" },
      { "id": "12", "text": "Desember" },
    ];

    this.dataSelectTahun = [
      { "id": "2020", "text": "2020" },
      { "id": "2021", "text": "2021" },
      { "id": "2022", "text": "2022" },
      { "id": "2023", "text": "2023" },
      { "id": "2024", "text": "2024" },
      { "id": "2025", "text": "2025" },

    ];

  }

  reportKaryawan() {
    this.isFormKaryawanSubmitted = true;
    if (this.karyawanForm.invalid) {
      return;
    }

    let lokasi_id = (this.karyawanForm.controls['lokasi'].value != null) ? this.karyawanForm.controls['lokasi'].value['id'] : null;
    let sub_bagian_id = (this.karyawanForm.controls['sub_bagian'].value != null) ? this.karyawanForm.controls['sub_bagian'].value['id'] : null;
    let status_id = this.karyawanForm.controls['status'].value;
    let format_laporan = this.karyawanForm.controls['format_laporan'].value;
    let dataSubmit = {
      'lokasi_id': lokasi_id,
      'sub_bagian_id': sub_bagian_id,
      'status_id': status_id,
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit)
    this.karyawanService.getLaporanKaryawan(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'karyawan_rekap.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportAbsensi() {
    this.isFormAbsensiSubmitted = true;
    if (this.absensiForm.invalid) {
      return;
    }

    let dataSubmit;
    let karyawan_id = this.absensiForm.controls['karyawanAbsensi'].value['id'] ? this.absensiForm.controls['karyawanAbsensi'].value['id'] : null;

    dataSubmit = {
      'karyawan_id': karyawan_id,
      'tgl_mulai': formatDate(this.absensiForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.absensiForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    this.absensiService.getAbsensiKaryawan(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }

  reportLembur() {
    this.isFormLemburSubmitted = true;
    if (this.lemburForm.invalid) {
      return;
    }

    let dataSubmit;
    let karyawan_id = this.lemburForm.controls['karyawanLembur'].value['id'] ? this.lemburForm.controls['karyawanLembur'].value['id'] : null;

    dataSubmit = {
      'karyawan_id': karyawan_id,
      'tgl_mulai': formatDate(this.lemburForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.lemburForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.lemburService.getLemburKaryawan(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }




}
