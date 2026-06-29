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
import { isNull, isNullOrUndefined } from 'util';
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
  isFormPemakaianBahanSubmitted = false;

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
  laporanPemakaianBahan: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectOrganisasi;
  dataSelectKendaraan;
  dataSelectKendaraan2;

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
      traksi_rinci: new FormControl([], Validators.required),
      kendaraan: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });
    this.laporanPemakaianBahan = this.builder.group({
      traksi_rinci: new FormControl([], Validators.required),
      kendaraan: new FormControl([]),
      format_laporan: new FormControl('view', Validators.required),

      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });


    this.laporanRekap = this.builder.group({
      traksi: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tipe_laporan: new FormControl('rasio', Validators.required),
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

    this.GbmOrganisasiService.getAllByType("TRAKSI").subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
      });
      this.dataSelectOrganisasi2 = [];
      x.forEach(d => {
        this.dataSelectOrganisasi2.push({ "id": d.id, "text": d.nama });
      });

      this.laporanRincian.controls['traksi_rinci'].valueChanges.subscribe(x => {
        let trk_id = x.id;
        console.log(x)
        this.trkKendaraanService.getByTraksiId(trk_id).subscribe(x => {
          console.log(x)
          this.dataSelectKendaraan = [];
          x['data'].forEach(d => {
            this.dataSelectKendaraan.push({ "id": d.id, "text": d.nama + ' - ' + d.kode });
          });
        });
      });
      this.laporanRincian.controls['traksi_rinci'].valueChanges.subscribe(x => {
        let trk_id = x.id;
        console.log(x)
        this.trkKendaraanService.getByTraksiId(trk_id).subscribe(x => {
          // console.log(x)
          this.dataSelectKendaraan = [];
          x['data'].forEach(d => {
            this.dataSelectKendaraan.push({ "id": d.id, "text": d.nama + ' - ' + d.kode });
          });
        });
      });
      this.laporanPemakaianBahan.controls['traksi_rinci'].valueChanges.subscribe(x => {
        let trk_id = x.id;
        console.log(x)
        this.trkKendaraanService.getByTraksiId(trk_id).subscribe(x => {
          // console.log(x)
          this.dataSelectKendaraan2 = [];
          x['data'].forEach(d => {
            this.dataSelectKendaraan2.push({ "id": d.id, "text": d.nama + ' - ' + d.kode });
          });
        });
      });

    });

  }

  reportDetail() {

    this.isFormDetailSubmitted = true;
    if (this.laporanRincian.invalid) {
      return;
    }
    let format_laporan = this.laporanRincian.controls['format_laporan'].value
    let traksi_id = (this.laporanRincian.controls['traksi_rinci'].value != null) ? this.laporanRincian.controls['traksi_rinci'].value['id'] : null;
    let kendaraan_id = (this.laporanRincian.controls['kendaraan'].value != null) ? this.laporanRincian.controls['kendaraan'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      traksi_id: traksi_id,
      kendaraan_id: kendaraan_id,
      tgl_mulai: formatDate(this.laporanRincian.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincian.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.accJurnalService.getLaporanCostTraksiDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_traksi.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

  reportRekap() {
    this.isFormRekapSubmitted = true;
    if (this.laporanRekap.invalid) {
      return;
    }
    let format_laporan = this.laporanRekap.controls['format_laporan'].value
    let tipe_laporan = this.laporanRekap.controls['tipe_laporan'].value
    let traksi_id = (this.laporanRekap.controls['traksi'].value != null) ? this.laporanRekap.controls['traksi'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      tipe_laporan: tipe_laporan,
      traksi_id: traksi_id,
      tgl_mulai: formatDate(this.laporanRekap.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRekap.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    if (tipe_laporan == 'rekap') {
      this.accJurnalService.getLaporanCostTraksiRekap(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_traksi.xls')
        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });
    }
    else if (tipe_laporan == 'rasio'){
      this.accJurnalService.getLaporanCostTraksiRasio(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_traksi.xls')
        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });

    }else if (tipe_laporan == 'pemakaian_bbm'){
      this.accJurnalService.getLaporanRekapCostPemakaianBBM(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_traksi.xls')
        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });

    }
  }

  reportPemakaianBahan() {

    this.isFormPemakaianBahanSubmitted = true;
    if (this.laporanPemakaianBahan.invalid) {
      return;
    }
    let format_laporan = this.laporanPemakaianBahan.controls['format_laporan'].value
    let traksi_id = (this.laporanPemakaianBahan.controls['traksi_rinci'].value != null) ? this.laporanPemakaianBahan.controls['traksi_rinci'].value['id'] : null;
    let kendaraan_id;// = (this.laporanPemakaianBahan.controls['kendaraan'].value != null) ? this.laporanPemakaianBahan.controls['kendaraan'].value['id'] : null;

    if (isNull(this.laporanPemakaianBahan.controls['kendaraan'].value)) {
      kendaraan_id = null;
    } else {
      kendaraan_id = this.laporanPemakaianBahan.controls['kendaraan'].value['id'] ? this.laporanPemakaianBahan.controls['kendaraan'].value['id'] : null;

    }
    let data = {
      format_laporan: format_laporan,
      traksi_id: traksi_id,
      kendaraan_id: kendaraan_id,
      tgl_mulai: formatDate(this.laporanPemakaianBahan.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanPemakaianBahan.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    console.log(data)
    this.accJurnalService.getLaporanPemakaianBahanTraksi(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_traksi.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

}
