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
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
import { WrkKegiatanService } from 'src/app/shared/services/wrk_kegiatan.service';
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
  // isFormPenerimaanTbsHarianSubmitted = false;
  // isFormPenerimaanTbsBulananSubmitted = false;
  // isFormPenerimaanTbsRincianSubmitted = false;
  // isFormRincianPoSubmitted = false;
  // isFormPenerimaanTbsRekapSubmitted = false;
  isFormRincianMaterialSubmitted = false;
  isFormRincianFrestasiSubmitted = false;
  isFormRincianKegiatanSubmitted = false;
  
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

  // penerimaanTbsHarianForm: FormGroup;
  // penerimaanTbsBulananForm: FormGroup;
  // penerimaanTbsRincianForm: FormGroup;
  // laporanRincianPo: FormGroup;
  // penerimaanTbsRekapForm: FormGroup;
  laporanRincianMaterial: FormGroup;
  laporanRincianKegiatan: FormGroup;
  laporanRincianFrestasi: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectOrganisasi;
  dataSelectKendaraan;
  dataSelectBlok;
  // dataSelectGudang;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private TrkKendaraanService: TrkKendaraanService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private WrkKegiatanService: WrkKegiatanService,

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


    this.laporanRincianMaterial = this.builder.group({
      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.laporanRincianKegiatan = this.builder.group({
      lokasi: new FormControl([]),
      kendaraan: new FormControl([]),
      blok: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
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




    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
      });

      // this.laporanRincianPo.controls['lokasi'].valueChanges.subscribe(x => {
      //   let org_id = x.id;
      //   console.log(x)
      //   this.GbmOrganisasiService.getGudangByUnit(org_id).subscribe(x => {
      //     console.log(x)
      //     this.dataSelectGudang = [];
      //     x.forEach(d => {
      //       this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
      //     });
      //   });
      // });
      
    });

    this.GbmOrganisasiService.getAllByType("BLOK_MESIN").subscribe(x => {
      this.dataSelectBlok = [];
      x.forEach(d => {
        this.dataSelectBlok.push({ "id": d.id, "text": d.nama });
      });
    });

    this.TrkKendaraanService.getAll().subscribe(x=> {
      this.dataSelectKendaraan=[];
      x['data'].forEach(d => {
        this.dataSelectKendaraan.push({ "id": d.id, "text": d.kode + " - " + d.nama+"("+d.traksi+")" });
      });
    });

    // this.gbmSupplierService.getAll().subscribe(x => {
    //   this.dataSelectSupplier = [];
    //   x['data'].forEach(d => {
    //     this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
    //   });
    // });


  }

  reportMaterialRincian(tipe_laporan) {
    this.isFormRincianMaterialSubmitted = true;
    if (this.laporanRincianMaterial.invalid) {
      return;
    }

    let format_laporan = this.laporanRincianMaterial.controls['format_laporan'].value;
    let lokasi_id = (this.laporanRincianMaterial.controls['lokasi'].value != null) ? this.laporanRincianMaterial.controls['lokasi'].value['id'] : null;
    // let gudang_id = (this.laporanRincianPo.controls['gudang'].value != null) ? this.laporanRincianPo.controls['gudang'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      lokasi_id: lokasi_id,
      // gudang_id: gudang_id,
      tgl_mulai: formatDate(this.laporanRincianMaterial.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincianMaterial.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);

    this.WrkKegiatanService.getMaterialReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_workshop_kegiatan.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

  reportKegiatanRincian(tipe_laporan) {
    this.isFormRincianKegiatanSubmitted = true;
    if (this.laporanRincianKegiatan.invalid) {
      return;
    }

    let format_laporan = this.laporanRincianKegiatan.controls['format_laporan'].value;
    let lokasi_id = (this.laporanRincianKegiatan.controls['lokasi'].value != null) ? this.laporanRincianKegiatan.controls['lokasi'].value['id'] : null;
    let kendaraan_id = (this.laporanRincianKegiatan.controls['kendaraan'].value != null) ? this.laporanRincianKegiatan.controls['kendaraan'].value['id'] : null;
    let blok_id = (this.laporanRincianKegiatan.controls['blok'].value != null) ? this.laporanRincianKegiatan.controls['blok'].value['id'] : null;
    // let gudang_id = (this.laporanRincianPo.controls['gudang'].value != null) ? this.laporanRincianPo.controls['gudang'].value['id'] : null;
    let data = {
      format_laporan: format_laporan,
      lokasi_id: lokasi_id,
      kendaraan_id: kendaraan_id,
      blok_id: blok_id,
      // gudang_id: gudang_id,
      tgl_mulai: formatDate(this.laporanRincianKegiatan.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincianKegiatan.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
console.log(data);
    this.WrkKegiatanService.getKegiatanReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_workshop_frestasi.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
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
      lokasi_id: lokasi_id,
      // gudang_id: gudang_id,
      tgl_mulai: formatDate(this.laporanRincianFrestasi.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincianFrestasi.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.WrkKegiatanService.getFrestasiReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_workshop_frestasi.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
