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
import { AccSalesInvoiceService } from 'src/app/shared/services/acc_sales_invoice.service';
import { GbmCustomerService } from 'src/app/shared/services/gbm_customer.service';
import { saveAs } from 'file-saver';
import { isNullOrUndefined } from 'util';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
declare var swal: any;

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormPenerimaanTbsHarianSubmitted = false;
  isFormPenerimaanTbsBulananSubmitted = false;
  isFormPenerimaanTbsRincianSubmitted = false;
  isFormRincianPoSubmitted = false;
  isFormPenerimaanTbsRekapSubmitted = false;
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

  penerimaanTbsHarianForm: FormGroup;
  penerimaanTbsBulananForm: FormGroup;
  penerimaanTbsRincianForm: FormGroup;
  laporanRincianAp: FormGroup;
  penerimaanTbsRekapForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectKontrak;
  dataSelectOrganisasi;
  dataSelectCustomer;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];
  dataSelectProduk: any[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmcustomerService: GbmCustomerService,
    private accSalesInvoiceService: AccSalesInvoiceService,
    private invItemService: InvItemService,
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

    this.dataSelectTipe = [

      { "id": "INT", "text": "INTERNAL" },
      { "id": "EXT", "text": "EXTERNAL" },


    ];


    this.laporanRincianAp = this.builder.group({
      lokasi: new FormControl([]),
      customer: new FormControl([],),
      produk: new FormControl([],),
      status: new FormControl("0",),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      // tanggal_akhir: new FormControl(toDate, Validators.required),
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
    });
    this.gbmcustomerService.getAll().subscribe(x => {
      this.dataSelectCustomer = [];
      x['data'].forEach(d => {
        this.dataSelectCustomer.push({ "id": d.id, "text": d.nama_customer });
      });
    });
    this.invItemService.getAllProduk().subscribe(x => {
      this.dataSelectProduk = [];
      x['data'].forEach(d => {
        this.dataSelectProduk.push({ "id": d.id, "text": d.nama });
      });
    });


  }

  reportApRincian(tipe_laporan) {
    this.isFormRincianPoSubmitted = true;
    if (this.laporanRincianAp.invalid) {
      return;
    }

    let lokasi_id = (this.laporanRincianAp.controls['lokasi'].value != null) ? this.laporanRincianAp.controls['lokasi'].value['id'] : null;
    let customer_id = (this.laporanRincianAp.controls['customer'].value != null) ? this.laporanRincianAp.controls['customer'].value['id'] : null;
    let produk_id = (this.laporanRincianAp.controls['produk'].value != null) ? this.laporanRincianAp.controls['produk'].value['id'] : null;
    tipe_laporan = this.laporanRincianAp.controls['format_laporan'].value;
    let data = {
      tipe_laporan: tipe_laporan,
      lokasi_id: lokasi_id,
      customer_id: customer_id,
      produk_id: produk_id,
      status:this.laporanRincianAp.controls['status'].value,
      tgl_mulai: formatDate(this.laporanRincianAp.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      // tgl_akhir: formatDate(this.laporanRincianAp.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.accSalesInvoiceService.getArReportDetail(data).subscribe((res: any) => {
      if (tipe_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'Laporan_AR_ext.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });
  }



}
