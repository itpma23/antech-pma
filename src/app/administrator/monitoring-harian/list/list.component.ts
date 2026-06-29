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
import { MonitoringHarianService } from 'src/app/shared/services/monitoring_harian.service';
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
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
  isFormPenerimaanTbsHarianSubmitted = false;
  isFormPenerimaanTbsBulananSubmitted = false;
  isFormPenerimaanTbsRincianSubmitted = false;
  isFormPenerimaanTbsRekapSubmitted = false;
  isFormRincianSubmitted = false;
  isFormNonPostingSubmitted = false;
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
  penerimaanTbsRekapForm: FormGroup;
  laporanRincian: FormGroup;
  laporanNonPosting: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectKontrak;
  dataSelectOrganisasi;
  dataSelectSupplier;
  dataSelectTransaksi;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplierService: GbmSupplierService,
    private MonitoringHarianService: MonitoringHarianService,

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

    this.dataSelectTransaksi = [
      { "id": "est_bkm_panen_ht", "text": "BKM PANEN" },
      { "id": "est_bkm_pemeliharaan_ht", "text": "BKM PEMELIHARAAN" },
      { "id": "est_bkm_umum_ht", "text": "BKM UMUM" },
      { "id": "est_spk_ht", "text": "SPK" },
      { "id": "inv_penerimaan_po_ht", "text": "PENERIMAAN PO" },
      { "id": "inv_penerimaan_tanpa_po_ht", "text": "PENERIMAAN TANPA PO" },
      { "id": "inv_pemakaian_ht", "text": "PEMAKAIAN" },
      { "id": "inv_pindah_gudang_ht", "text": "PINDAH GUDANG" },
      { "id": "inv_penerimaan_pindah_gudang_ht", "text": "PENERIMAAN PINDAH GUDANG" },
      { "id": "trk_kegiatan_kendaraan_ht", "text": "KEGIATAN KENDARAAN" },
      { "id": "wrk_kegiatan_ht", "text": "KEGIATAN KENDARAN" },
      { "id": "acc_kasbank_ht", "text": "KAS & BANK" },
    ];


    this.laporanRincian = this.builder.group({
      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });

    this.laporanNonPosting = this.builder.group({
      lokasi: new FormControl([]),
      transaksi: new FormControl([]),
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
    });
    
    this.gbmSupplierService.getAll().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
    });


  }

  reportPoRincian(tipe_laporan) {
    this.isFormRincianSubmitted = true;
    if (this.laporanRincian.invalid) {
      return;
    }

    let lokasi_id = (this.laporanRincian.controls['lokasi'].value != null) ? this.laporanRincian.controls['lokasi'].value['id'] : null;
    let format_laporan=this.laporanRincian.controls['format_laporan'].value;
    let data = {
      lokasi_id: lokasi_id,
      tgl_mulai: formatDate(this.laporanRincian.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincian.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      format_laporan: format_laporan,
    };

    console.log(data);
    this.MonitoringHarianService.getReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rincian_kontrak.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }


  reportNonPosting(tipe_laporan) {
    this.isFormNonPostingSubmitted = true;
    if (this.laporanNonPosting.invalid) {
      return;
    }

    let lokasi_id = (this.laporanNonPosting.controls['lokasi'].value != null) ? this.laporanNonPosting.controls['lokasi'].value['id'] : null;
    // let transaksi_id = (this.laporanNonPosting.controls['transaksi'].value != null) ? this.laporanNonPosting.controls['transaksi'].value['id'] : null;
    let format_laporan=this.laporanNonPosting.controls['format_laporan'].value;
    let data = {
      lokasi_id: lokasi_id,
      transaksi_id: this.laporanNonPosting.controls['transaksi'].value,
      tgl_mulai: formatDate(this.laporanNonPosting.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanNonPosting.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      format_laporan: format_laporan,
    };

    console.log(data);
    this.MonitoringHarianService.getReportNonPosting(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'laporan_monitoring_harian_non_posting.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
