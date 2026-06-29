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
import { AccUangMukaRealisasiService } from 'src/app/shared/services/acc_uang_muka_realisasi.service';
import { isNullOrUndefined } from 'util';
import { AccKuitansiPembelianTbsService } from 'src/app/shared/services/acc_kuitansi_pembelian_tbs.service';
declare var swal: any;

declare var $: any;
import { saveAs } from 'file-saver';
import { AccTbsInvoiceService } from 'src/app/shared/services/acc_tbs_invoice.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
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

  UangMukaRealisasiRekapDetailForm: FormGroup;
  KwitansiPembelianTbsRekap: FormGroup;
  invoicePembelianTbsRekap: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKategori;
  dataSelectAkun;
  dataSelectLokasi;
  dataSelectSupplier;




  bsModalRef: BsModalRef;
  dataSelectLokasi2: any[];
  dataSelectKategoris: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private AccAkunService: AccAkunService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private accUangMukaService: AccUangMukaRealisasiService,
    private accTbsInvoiceService: AccTbsInvoiceService,
    private gbmSupplierService: GbmSupplierService,
    private accKwitansiPembelianService: AccKuitansiPembelianTbsService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.KwitansiPembelianTbsRekap = this.builder.group({

      // kategori: new FormControl([],),
      lokasi: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      supplier: new FormControl([],),

    });

    this.invoicePembelianTbsRekap = this.builder.group({

      // kategori: new FormControl([],),
      lokasi: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      supplier: new FormControl([],),

    });
    this.UangMukaRealisasiRekapDetailForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      akun: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      supplier: new FormControl([],),

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

    });

    this.gbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
    });

  }


  reportRekapInvoicePembelianTbs() {
    this.isFormSubmitted2 = true;
    if (this.invoicePembelianTbsRekap.invalid) {
      return;
    }

    let dataSubmit;
    let lokasi_id = this.invoicePembelianTbsRekap.controls['lokasi'].value['id'] ? this.invoicePembelianTbsRekap.controls['lokasi'].value['id'] : null;
    let format_laporan = this.invoicePembelianTbsRekap.controls['format_laporan'].value;
    let supplier_id = this.invoicePembelianTbsRekap.controls['supplier'].value
      ? this.invoicePembelianTbsRekap.controls['supplier'].value['id']
      : null;

    dataSubmit = {
      'mill_id': lokasi_id,
      'supplier_id': supplier_id,
      'tgl_mulai': formatDate(this.invoicePembelianTbsRekap.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.invoicePembelianTbsRekap.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan


    };
    console.log(dataSubmit);
    this.accTbsInvoiceService.getRekapInvoicePembelianTbs(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rekap_kwitansi_pembelian_tbs.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }

  reportRekapKwitansiPembelianTbs() {
    this.isFormSubmitted2 = true;
    if (this.KwitansiPembelianTbsRekap.invalid) {
      return;
    }

    let dataSubmit;
    let lokasi_id = this.KwitansiPembelianTbsRekap.controls['lokasi'].value['id'] ? this.KwitansiPembelianTbsRekap.controls['lokasi'].value['id'] : null;
    let format_laporan = this.KwitansiPembelianTbsRekap.controls['format_laporan'].value;
    let supplier_id = (this.KwitansiPembelianTbsRekap.controls['supplier'].value != null) ? this.KwitansiPembelianTbsRekap.controls['supplier'].value['id'] : null;
    dataSubmit = {
      'mill_id': lokasi_id,
      'supplier_id': supplier_id,
      'tgl_mulai': formatDate(this.KwitansiPembelianTbsRekap.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.KwitansiPembelianTbsRekap.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan


    };
    console.log(dataSubmit);
    this.accKwitansiPembelianService.getRekapKwitansiPembelianTbs(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rekap_kwitansi_pembelian_tbs.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportSaldoDetail() {
    this.isFormSubmitted = true;
    if (this.UangMukaRealisasiRekapDetailForm.invalid) {
      return;
    }

    let dataSubmit;



    let akun_id = this.UangMukaRealisasiRekapDetailForm.controls['akun'].value['id'] ? this.UangMukaRealisasiRekapDetailForm.controls['akun'].value['id'] : null;
    let lokasi_id = this.UangMukaRealisasiRekapDetailForm.controls['lokasi'].value['id'] ? this.UangMukaRealisasiRekapDetailForm.controls['lokasi'].value['id'] : null;

    dataSubmit = {
      'lokasi_id': lokasi_id,
      'akun_id': akun_id,
      'tgl_mulai': formatDate(this.UangMukaRealisasiRekapDetailForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.UangMukaRealisasiRekapDetailForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),


    };
    console.log(dataSubmit);
    this.accUangMukaService.getLaporanRinci(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }


}
