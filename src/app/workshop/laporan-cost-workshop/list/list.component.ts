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


import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccJurnalService } from 'src/app/shared/services/acc_jurnal.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { saveAs } from 'file-saver';
import { isNullOrUndefined } from 'util';
declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {

  isFormDetailSubmitted = false;
  isFormRekapSubmitted = false;

  dataSelectBulan;
  dataSelectTahun;

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

  laporanRincian: FormGroup;
  laporanRekap: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectOrganisasi;
  dataSelectKendaraan;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];
  dataSelectOrganisasi2: any[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private trkKendaraanService: TrkKendaraanService,
    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private accJurnalService: AccJurnalService,

    private builder: FormBuilder) {
    let toDate: Date = new Date();

    /* this.dataSelectBulan = [
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
    ]; */

    // this.dataSelectTahun = [
    //   { "id": "2022", "text": "2022" },
    //   { "id": "2023", "text": "2023" },
    //   { "id": "2024", "text": "2024" },
    //   { "id": "2025", "text": "2025" },
    // ];

    // this.dataSelectTipe = [
    //   { "id": "INT", "text": "INTERNAL" },
    //   { "id": "EXT", "text": "EXTERNAL" },
    // ];


    this.laporanRincian = this.builder.group({
      workshop_rinci: new FormControl([], Validators.required),
      kendaraan: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });

    this.laporanRekap = this.builder.group({
      workshop: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
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

    this.GbmOrganisasiService.getAllByType("WORKSHOP").subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
      });
      // this.dataSelectOrganisasi2 = [];
      // x.forEach(d => {
      //   this.dataSelectOrganisasi2.push({ "id": d.id, "text": d.nama });
      // });

      // this.laporanRincian.controls['workshop_rinci'].valueChanges.subscribe(x => {
      //   let trk_id = x.id;
      //   console.log(x)
      //   this.trkKendaraanService.getByworkshopId(trk_id).subscribe(x => {
      //     console.log(x)
      //     this.dataSelectKendaraan = [];
      //     x['data'].forEach(d => {
      //       this.dataSelectKendaraan.push({ "id": d.id, "text": d.nama });
      //     });
      //   });
      // });

    });

  }

  reportDetail() {

    this.isFormDetailSubmitted = true;
    if (this.laporanRincian.invalid) {
      return;
    }
    let format_laporan = this.laporanRincian.controls['format_laporan'].value
    let workshop_id = (this.laporanRincian.controls['workshop_rinci'].value != null) ? this.laporanRincian.controls['workshop_rinci'].value['id'] : null;
    let kendaraan_id = (this.laporanRincian.controls['kendaraan'].value != null) ? this.laporanRincian.controls['kendaraan'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      workshop_id: workshop_id,
      kendaraan_id: kendaraan_id,
      tgl_mulai: formatDate(this.laporanRincian.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincian.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.accJurnalService.getLaporanCostWorkshopRekap(data).subscribe((res: any) => {
      if (format_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_ext.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

  reportRekap() {
    console.log(this.laporanRekap.value)
    this.isFormRekapSubmitted = true;
    if (this.laporanRekap.invalid) {
      return;
    }
    let format_laporan = this.laporanRekap.controls['format_laporan'].value
    let workshop_id = (this.laporanRekap.controls['workshop'].value != null) ? this.laporanRekap.controls['workshop'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      workshop_id: workshop_id,
      tgl_mulai: formatDate(this.laporanRekap.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRekap.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.accJurnalService.getLaporanCostWorkshopRekap(data).subscribe((res: any) => {
      if (format_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_ext.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
