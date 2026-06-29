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
import { TrkKegiatanKendaraanService } from 'src/app/shared/services/trk_kegiatan_kendaraan.service';
import { saveAs } from 'file-saver';
import { isNullOrUndefined } from 'util';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {

  isFormRincianKegiatanSubmitted = false;
  isFormRincianFrestasiSubmitted = false;

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


  laporanRincianKegiatan: FormGroup;
  laporanRincianFrestasi: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectOrganisasi;
  // dataSelectGudang;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];
  dataSelectKendaraan: any;
  dataSelectTraksi: any[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private TrkKegiatanKendaraanService: TrkKegiatanKendaraanService,
    private trkKegiatanKendaraanService: TrkKegiatanKendaraanService,
    private trkKendaraanService: TrkKendaraanService,
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


    this.laporanRincianKegiatan = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      traksi_id: new FormControl([]),
      kendaraan_id: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      jenis: new FormControl('detail', Validators.required),
    });

    this.laporanRincianFrestasi = this.builder.group({
      lokasi: new FormControl([]),

      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
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




    // this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
    //   this.dataSelectOrganisasi = [];
    //   x.forEach(d => {
    //     this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
    //   });



    // });


    this.GbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
      });
      this.laporanRincianKegiatan.controls['lokasi'].valueChanges.subscribe(x => {
        let org_id = x.id;

        this.GbmOrganisasiService.getAllByType('TRAKSI').subscribe(x => {
          this.dataSelectTraksi = [];
          x.forEach(d => {
            if (d.parent_id == org_id) {
              this.dataSelectTraksi.push({ "id": d.id, "text": d.nama });
            }
          });
          this.laporanRincianKegiatan.controls['traksi_id'].valueChanges.subscribe(x => {
            let traksi_id = x.id;
            this.trkKendaraanService.getAll().subscribe(x => {
              this.dataSelectKendaraan = [];
              x['data'].forEach(d => {
                if (d.traksi_id == traksi_id) {
                  this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama });
                }
              });
            })
          });
        });


      });

    });



  }

  reportKegiatanRincian(tipe_laporan) {
    this.isFormRincianKegiatanSubmitted = true;
    if (this.laporanRincianKegiatan.invalid) {
      return;
    }

    let format_laporan = this.laporanRincianKegiatan.controls['format_laporan'].value;
    let lokasi_id = (this.laporanRincianKegiatan.controls['lokasi'].value != null) ? this.laporanRincianKegiatan.controls['lokasi'].value['id'] : null;
    let traksi_id = (this.laporanRincianKegiatan.controls['traksi_id'].value != null) ? this.laporanRincianKegiatan.controls['traksi_id'].value['id'] : null;
    let kendaraan_id;
    if (isNullOrUndefined(this.laporanRincianKegiatan.get('kendaraan_id').value) != true) {
      if (isNullOrUndefined(this.laporanRincianKegiatan.get('kendaraan_id').value!.id)) {
        kendaraan_id = null
      } else {
        kendaraan_id = this.laporanRincianKegiatan.get('kendaraan_id').value.id;
      }
    } else {
      kendaraan_id = null
    }
    let jenis = this.laporanRincianKegiatan.controls['jenis'].value;
    let data = {
      format_laporan: format_laporan,
      tipe_laporan: format_laporan,
      lokasi_id: lokasi_id,
      traksi_id: traksi_id,
      kendaraan_id: kendaraan_id,
      tgl_mulai: formatDate(this.laporanRincianKegiatan.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincianKegiatan.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
    if (jenis == 'detail') {
      this.TrkKegiatanKendaraanService.getKegiatanReportDetail(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_traksi_kegiatan.xls')
        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });
    } else {
      this.TrkKegiatanKendaraanService.getKegiatanReportLogByTanggal(data).subscribe((res: any) => {
        if (format_laporan == 'xls') {
          let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
          saveAs(blob, 'laporan_traksi_kegiatan.xls')
        } else {
          var fileURL = URL.createObjectURL(res);
          window.open(fileURL);
        }
      });

    }
  }

  reportFrestasiRincian(tipe_laporan) {
    this.isFormRincianFrestasiSubmitted = true;
    if (this.laporanRincianFrestasi.invalid) {
      return;
    }

    let format_laporan = this.laporanRincianFrestasi.controls['format_laporan'].value;
    let lokasi_id = (this.laporanRincianFrestasi.controls['lokasi'].value != null) ? this.laporanRincianFrestasi.controls['lokasi'].value['id'] : null;
    // let gudang_id = (this.laporanRincianPo.controls['gudang'].value != null) ? this.laporanRincianPo.controls['gudang'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      tipe_laporan: format_laporan,
      lokasi_id: lokasi_id,
      // gudang_id: gudang_id,
      tgl_mulai: formatDate(this.laporanRincianFrestasi.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincianFrestasi.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.TrkKegiatanKendaraanService.getFrestasiReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_traksi_frestasi.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
