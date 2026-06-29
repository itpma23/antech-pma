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

import { AccAkunService } from 'src/app/shared/services/acc_akun.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { AccKasbankService } from 'src/app/shared/services/acc_kasbank.service';
import { isNullOrUndefined } from 'util';
declare var swal: any;

declare var $: any;
import { saveAs } from 'file-saver';
import { AccPermintaanDanaService } from 'src/app/shared/services/acc_permintaan_dana.service';

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormSubmitted = false;
  isFormSubmitted2 = false;
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

  KasbankDetailForm: FormGroup;
  KasbankRekapForm: FormGroup;
  TransaksiKasbankForm: FormGroup;
  permintaanDanaForm: FormGroup;
  permintaanDanaRealisasiForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKategori;
  dataSelectAkun;
  dataSelectLokasi;




  bsModalRef: BsModalRef;
  dataSelectLokasi2: any[];
  dataSelectKategoris: any;
  dataSelectPermintaanDana: any[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,
    private translate: TranslateService,
    private AccAkunService: AccAkunService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private accKasbankService: AccKasbankService,
    private accPermintaanDanaService: AccPermintaanDanaService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.KasbankRekapForm = this.builder.group({
      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.KasbankDetailForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      akun: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tipe_laporan: new FormControl('v1', Validators.required),
    });
    this.TransaksiKasbankForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      // akun: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.permintaanDanaForm = this.builder.group({
      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.permintaanDanaRealisasiForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      permintaan_dana: new FormControl([], Validators.required),
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
    // this.accPermintaanDanaService.getAll().subscribe(x => {
    //   console.log(x)
    //   this.dataSelectPermintaanDana = [];
    //   let d = x['data'];
    //   d.forEach(d => {
    //     this.dataSelectPermintaanDana.push({ "id": d.id, "text": d.no_transaksi });

    //   });

    // });
    this.AccAkunService.getAllKasbank().subscribe(x => {
      this.dataSelectAkun = [];
      let a = x['data'];
      a.forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.nama + "(" + d.kode + ")" });

      });

    });

    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      // let g=x['data'];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

      });
      this.permintaanDanaRealisasiForm.controls['lokasi'].valueChanges.subscribe(x => {
        let lokasi_id = x.id;
        this.accPermintaanDanaService.getAllByUnit(lokasi_id).subscribe(x => {
          this.dataSelectPermintaanDana = [];
          x['data'].forEach(d => {
            this.dataSelectPermintaanDana.push({ "id": d.id, "text": d.no_transaksi + '(' + d.tanggal + ')' });
          });
        });


      });

    });


  }

  reportSaldo() {
    this.isFormSubmitted2 = true;
    if (this.KasbankRekapForm.invalid) {
      return;
    }

    let dataSubmit;

    // let kategori_id;
    // if (isNullOrUndefined(this.KasbankRekapForm.get('kategori').value) != true) {
    //   if (isNullOrUndefined(this.KasbankRekapForm.get('kategori').value!.id)) {
    //     kategori_id = null
    //   } else {
    //     kategori_id = this.KasbankRekapForm.get('kategori').value.id;
    //   }

    // } else {
    //   kategori_id = null
    // }
    let lokasi_id = (this.KasbankRekapForm.controls['lokasi'].value != null) ? this.KasbankRekapForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.KasbankRekapForm.controls['format_laporan'].value;
    dataSubmit = {
      'lokasi_id': lokasi_id,
      'tgl_mulai': formatDate(this.KasbankRekapForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.KasbankRekapForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit);
    this.accKasbankService.getLaporanSaldo(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'kasbank_rekap.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportSaldoDetail() {
    this.isFormSubmitted = true;
    if (this.KasbankDetailForm.invalid) {
      return;
    }

    let dataSubmit;

    let akun_id = this.KasbankDetailForm.controls['akun'].value['id'] ? this.KasbankDetailForm.controls['akun'].value['id'] : null;
    let lokasi_id = this.KasbankDetailForm.controls['lokasi'].value['id'] ? this.KasbankDetailForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.KasbankDetailForm.controls['format_laporan'].value;
    let tipe_laporan = this.KasbankDetailForm.controls['tipe_laporan'].value;
    dataSubmit = {
      'lokasi_id': lokasi_id,
      'akun_id': akun_id,
      'tgl_mulai': formatDate(this.KasbankDetailForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.KasbankDetailForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,
      'tipe_laporan': tipe_laporan,

    };
    console.log(dataSubmit);
    this.accKasbankService.getLaporanSaldoRinci(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'kasbank_detail.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportTransaksiKasbank() {
    this.isFormSubmitted = true;
    if (this.TransaksiKasbankForm.invalid) {
      return;
    }

    let dataSubmit;

    // let akun_id = this.KasbankDetailForm.controls['akun'].value['id'] ? this.KasbankDetailForm.controls['akun'].value['id'] : null;
    let lokasi_id = this.TransaksiKasbankForm.controls['lokasi'].value['id'] ? this.TransaksiKasbankForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.TransaksiKasbankForm.controls['format_laporan'].value;
    dataSubmit = {
      'lokasi_id': lokasi_id,
      // 'akun_id': akun_id,
      'tgl_mulai': formatDate(this.TransaksiKasbankForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.TransaksiKasbankForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit);
    this.accKasbankService.getLaporanTransaksiKasbank(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'kasbank_detail.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportPermintaanDana() {
    this.isFormSubmitted = true;
    if (this.permintaanDanaForm.invalid) {
      return;
    }

    let dataSubmit;

    // let lokasi_id = this.permintaanDanaForm.controls['lokasi'].value['id'] ? this.permintaanDanaForm.controls['lokasi'].value['id'] : null;
     let lokasi_id;
    if (isNullOrUndefined(this.permintaanDanaForm.get('lokasi').value) != true) {
      if (isNullOrUndefined(this.permintaanDanaForm.get('lokasi').value!.id)) {
        lokasi_id = null
      } else {
        lokasi_id = this.permintaanDanaForm.get('lokasi').value.id;
      }

    } else {
      lokasi_id = null
    }
     let format_laporan = this.permintaanDanaForm.controls['format_laporan'].value;
    dataSubmit = {
      'lokasi_id': lokasi_id,
      'tgl_mulai': formatDate(this.permintaanDanaForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.permintaanDanaForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit);
    this.accPermintaanDanaService.getLaporanPermintaanDana(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'permintaan_Dana.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }
  reportPermintaanDanaRealisasi() {
    this.isFormSubmitted = true;
    if (this.permintaanDanaRealisasiForm.invalid) {
      return;
    }

    let dataSubmit;

    let permintaan_dana_id = this.permintaanDanaRealisasiForm.controls['permintaan_dana'].value['id'] ? this.permintaanDanaRealisasiForm.controls['permintaan_dana'].value['id'] : null;
    let lokasi_id = this.permintaanDanaRealisasiForm.controls['lokasi'].value['id'] ? this.permintaanDanaRealisasiForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.permintaanDanaRealisasiForm.controls['format_laporan'].value;
    dataSubmit = {
      'lokasi_id': lokasi_id,
      'permintaan_dana_id': permintaan_dana_id,
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit);
    this.accPermintaanDanaService.getLaporanPermintaanDanaRealisasi(dataSubmit).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'kasbank_detail.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }

}
