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
import { PksMaintenanceLogService } from 'src/app/shared/services/pks_maintenance_log.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { isNull, isNullOrUndefined } from 'util';
import { saveAs } from 'file-saver';

declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormSubmitted = false;
  isFormPemakaianBahanSubmitted = false; dataSelectMill2: any[];
  laporanByMesinForm: FormGroup;
  ;
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
  pemakaianBahanForm: FormGroup;
  laporanDetailCostForm: FormGroup;
  laporanMaintenanceRutinForm: FormGroup;
  costPerKegiatanForm: FormGroup;
  costPerbulanForm: FormGroup;
  panenWbForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectStasiun;
  dataSelectMill;

  bsModalRef: BsModalRef;
  dataSelectTahun: { id: string; text: string; }[];
  dataSelectBulan: { id: string; text: string; }[];
  isFormPanenPerbulanSubmitted: boolean;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private translate: TranslateService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private pksMaintenanceLogService: PksMaintenanceLogService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

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
      { "id": "2022", "text": "2022" },
      { "id": "2023", "text": "2023" },
      { "id": "2024", "text": "2024" },
      { "id": "2025", "text": "2025" },
      { "id": "2026", "text": "2026" },
    ];


    this.costPerKegiatanForm = this.builder.group({

      // stasiun: new FormControl([],),
      mill: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.laporanByMesinForm = this.builder.group({
      // stasiun: new FormControl([],),
      mill: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.laporanDetailCostForm = this.builder.group({
      mill: new FormControl([], Validators.required),
      stasiun: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.pemakaianBahanForm = this.builder.group({
      mill2: new FormControl([], Validators.required),
      stasiun: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.laporanMaintenanceRutinForm = this.builder.group({
      mill: new FormControl([], Validators.required),
      versi_laporan: new FormControl("v1", Validators.required),
      // stasiun: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.costPerbulanForm = this.builder.group({
      mill: new FormControl([], Validators.required),
      // tipe: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });

  }

  ngOnInit() {


  }


  ngAfterViewInit(): void {
    this.loadSelect2();

  }
  ngOnDestroy(): void {

  }

  exportFiles(type) {
    this.exportAsConfig.type = type;
    this.exportAsService.save(this.exportAsConfig, 'mapel').subscribe(() => { });
  }
  private loadSelect2(): void {

    // this.gbmOrganisasiService.getAllByType('stasiun').subscribe(x => {
    //    this.dataSelectStasiun = [];
    //     x.forEach(d => {
    //     this.dataSelectStasiun.push({ "id": d.id, "text": d.nama +'-'+d.kode });

    //   });

    // });
    this.gbmOrganisasiService.getAllByType('STASIUN').subscribe(x => {
      this.dataSelectStasiun = [];
      x.forEach(d => {
        this.dataSelectStasiun.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });

      });

    });
    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectMill = [];
      x.forEach(d => {
        this.dataSelectMill.push({ "id": d.id, "text": d.nama });

      });

    });
    this.gbmOrganisasiService.getAllByType('MILL').subscribe(x => {
      this.dataSelectMill2 = [];
      x.forEach(d => {
        this.dataSelectMill2.push({ "id": d.id, "text": d.nama });

      });

    });

  }


  reportDetail() {
    this.isFormSubmitted = true;
    if (this.laporanDetailCostForm.invalid) {
      return;
    }

    let dataSubmit;

    let stasiun_id;
    if (isNullOrUndefined(this.laporanDetailCostForm.get('stasiun')) != true) {
      if (isNullOrUndefined(this.laporanDetailCostForm.get('stasiun').value)) {
        stasiun_id = ''
      } else {
        stasiun_id = this.laporanDetailCostForm.get('stasiun').value.id;
      }

    } else {
      stasiun_id = ''
    }

    // let stasiun_id = this.laporanDetailCostForm.controls['stasiun'].value['id'] ? this.laporanDetailCostForm.controls['stasiun'].value['id'] : null;
    let mill_id = this.laporanDetailCostForm.controls['mill'].value['id'] ? this.laporanDetailCostForm.controls['mill'].value['id'] : null;
    let format_laporan = this.laporanDetailCostForm.controls['format_laporan'].value

    dataSubmit = {
      'mill_id': mill_id,
      'stasiun_id': stasiun_id,
      'tgl_mulai': formatDate(this.laporanDetailCostForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.laporanDetailCostForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.laporanDetailCostForm.controls['format_laporan'].value

    };
    console.log(dataSubmit);
    this.pksMaintenanceLogService.getLaporanDetail(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'buku_besar.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportMaintenanceRutin() {
    this.isFormSubmitted = true;
    if (this.laporanMaintenanceRutinForm.invalid) {
      return;
    }

    let dataSubmit;


    // let stasiun_id = this.laporanMaintenanceRutinForm.controls['stasiun'].value['id'] ? this.laporanMaintenanceRutinForm.controls['stasiun'].value['id'] : null;
    let mill_id = this.laporanMaintenanceRutinForm.controls['mill'].value['id'] ? this.laporanMaintenanceRutinForm.controls['mill'].value['id'] : null;
    let format_laporan = this.laporanMaintenanceRutinForm.controls['format_laporan'].value
    let versi_laporan = this.laporanMaintenanceRutinForm.controls['versi_laporan'].value
    dataSubmit = {
      'mill_id': mill_id,
      'versi_laporan': versi_laporan,
      'tgl_mulai': formatDate(this.laporanMaintenanceRutinForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.laporanMaintenanceRutinForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.laporanMaintenanceRutinForm.controls['format_laporan'].value

    };
    console.log(dataSubmit);
    this.pksMaintenanceLogService.getLaporanMaintenceRutin(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'buku_besar.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }

  reportCostPerKegiatan() {
    this.isFormSubmitted = true;
    if (this.costPerKegiatanForm.invalid) {
      return;
    }

    let dataSubmit;

    // let stasiun_id = this.laporanDetailCostForm.controls['stasiun'].value['id'] ? this.laporanDetailCostForm.controls['stasiun'].value['id'] : null;
    let mill_id = this.costPerKegiatanForm.controls['mill'].value['id'] ? this.costPerKegiatanForm.controls['mill'].value['id'] : null;
    let format_laporan = this.costPerKegiatanForm.controls['format_laporan'].value
    dataSubmit = {
      'mill_id': mill_id,
      // 'stasiun_id': stasiun_id,
      'tgl_mulai': formatDate(this.costPerKegiatanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.costPerKegiatanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.costPerKegiatanForm.controls['format_laporan'].value

    };
    console.log(dataSubmit);
    this.pksMaintenanceLogService.getLaporanByMesin(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'buku_besar.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportCostPerbulan() {
    this.isFormPanenPerbulanSubmitted = true;
    if (this.costPerbulanForm.invalid) {
      return;
    }
    // let tipe ;
    // if (isNullOrUndefined(this.costPerbulanForm.get('tipe')) != true) {
    //   if (isNullOrUndefined(this.costPerbulanForm.get('tipe').value)) {
    //     tipe = ''
    //   } else {
    //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
    //   }

    // } else {
    //   tipe = ''
    // }
    let mill_id = (this.costPerbulanForm.controls['mill'].value != null) ? this.costPerbulanForm.controls['mill'].value['id'] : null;
    let periode = this.costPerbulanForm.controls['tahun'].value.id + '-' + this.costPerbulanForm.controls['bulan'].value.id;
    let format_laporan = this.costPerbulanForm.controls['format_laporan'].value

    let data = {
      mill_id: mill_id,
      periode: periode,
      'format_laporan': this.costPerbulanForm.controls['format_laporan'].value
    };
    console.log(data);
    this.pksMaintenanceLogService.getLaporanByMesin(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'buku_besar.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }
  reportByMesin() {
    this.isFormPanenPerbulanSubmitted = true;
    if (this.laporanByMesinForm.invalid) {
      return;
    }
    // let tipe ;
    // if (isNullOrUndefined(this.costPerbulanForm.get('tipe')) != true) {
    //   if (isNullOrUndefined(this.costPerbulanForm.get('tipe').value)) {
    //     tipe = ''
    //   } else {
    //     tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
    //   }

    // } else {
    //   tipe = ''
    // }
    let mill_id = (this.laporanByMesinForm.controls['mill'].value != null) ? this.laporanByMesinForm.controls['mill'].value['id'] : null;
     let format_laporan = this.laporanByMesinForm.controls['format_laporan'].value

    let data = {
      'mill_id': mill_id,
      'tgl_mulai': formatDate(this.laporanByMesinForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.laporanByMesinForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': this.laporanByMesinForm.controls['format_laporan'].value
    };
    console.log(data);
    this.pksMaintenanceLogService.getLaporanByMesin(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'buku_besar.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }



}
