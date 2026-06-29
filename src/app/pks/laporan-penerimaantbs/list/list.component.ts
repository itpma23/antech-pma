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

import { PksProduksiService } from 'src/app/shared/services/pks_produksi.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
import { PksTimbanganService } from 'src/app/shared/services/pks_timbangan.service';
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
  isFormPenerimaanTbsRincianIntSubmitted = false;
  isFormPenerimaanTbsRincianExtSubmitted = false;
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
  penerimaanTbsRincianIntForm: FormGroup;
  penerimaanTbsRincianExtForm: FormGroup;
  penerimaanTbsRekapForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectKontrak;
  dataSelectOrganisasi;
  dataSelectSupplier;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private SlsKontrakService: SlsKontrakService,
    private PksSjppService: PksSjppService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private gbmSupplierService: GbmSupplierService,
    private PksTimbanganService: PksTimbanganService,

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


    this.penerimaanTbsHarianForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      tipe: new FormControl([]),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),

    });
    this.penerimaanTbsBulananForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      tipe: new FormControl([]),
      tahun: new FormControl([], Validators.required),
    });

    this.penerimaanTbsRincianForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      tipe: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });
    this.penerimaanTbsRincianIntForm = this.builder.group({
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });
    this.penerimaanTbsRincianExtForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      supplier: new FormControl([],),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
    });
    this.penerimaanTbsRekapForm = this.builder.group({
      tanggal: new FormControl(toDate, Validators.required),
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


    this.SlsKontrakService.getAll().subscribe(x => {
      this.dataSelectKontrak = [];
      console.log(x);
      let p = x['data'];
      p.forEach(d => {
        this.dataSelectKontrak.push({ "id": d.id, "text": d.no_spk + ' -- ' + d.customer });
      });
    });

    this.GbmOrganisasiService.getAllByType("MILL").subscribe(x => {
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


  reportPenerimaanTbsHarian(tipe_laporan) {
    this.isFormPenerimaanTbsHarianSubmitted = true;
    if (this.penerimaanTbsHarianForm.invalid) {
      return;
    }
    let tipe ;
    if (isNullOrUndefined(this.penerimaanTbsHarianForm.get('tipe')) != true) {
      if (isNullOrUndefined(this.penerimaanTbsHarianForm.get('tipe').value)) {
        tipe = ''
      } else {
        tipe = this.penerimaanTbsHarianForm.get('tipe').value.id;
      }

    } else {
      tipe = ''
    }
    let lokasi_id = (this.penerimaanTbsHarianForm.controls['lokasi'].value != null) ? this.penerimaanTbsHarianForm.controls['lokasi'].value['id'] : null;
    let periode = this.penerimaanTbsHarianForm.controls['tahun'].value.id + '-' + this.penerimaanTbsHarianForm.controls['bulan'].value.id;
    let data = {
      mill_id: lokasi_id,
      periode: periode,
      tipe: tipe,
      tipe_laporan:tipe_laporan
    };
    console.log(data);
    this.PksTimbanganService.getLaporanPenerimaanTbsHarian(data).subscribe((res: any) => {
      console.log(res);
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_report.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

    console.log('submit');
  }



  reportPenerimaanTbsBulanan(tipe_laporan) {
    this.isFormPenerimaanTbsBulananSubmitted = true;
    if (this.penerimaanTbsBulananForm.invalid) {
      return;
    }
    let tipe ;
    if (isNullOrUndefined(this.penerimaanTbsBulananForm.get('tipe')) != true) {
      if (isNullOrUndefined(this.penerimaanTbsBulananForm.get('tipe').value)) {
        tipe = ''
      } else {
        tipe = this.penerimaanTbsBulananForm.get('tipe').value.id;
      }

    } else {
      tipe = ''
    }
    let lokasi_id = (this.penerimaanTbsBulananForm.controls['lokasi'].value != null) ? this.penerimaanTbsBulananForm.controls['lokasi'].value['id'] : null;
    let tahun = (this.penerimaanTbsBulananForm.controls['tahun'].value != null) ? this.penerimaanTbsBulananForm.controls['tahun'].value['id'] : null;
    let data = {
      mill_id: lokasi_id,
      tahun: tahun,
      tipe: tipe,
      tipe_laporan:tipe_laporan

    };
    console.log(data);
    this.PksTimbanganService.getLaporanPenerimaanTbsBulanan(data).subscribe((res: any) => {
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_report.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

  reportPenerimaanTbsRincian(tipe_laporan) {
    this.isFormPenerimaanTbsRincianSubmitted = true;
    if (this.penerimaanTbsRincianForm.invalid) {
      return;
    }
    let tipe ;
    if (isNullOrUndefined(this.penerimaanTbsRincianForm.get('tipe')) != true) {
      if (isNullOrUndefined(this.penerimaanTbsRincianForm.get('tipe').value)) {
        tipe = ''
      } else {
        tipe = this.penerimaanTbsRincianForm.get('tipe').value.id;
      }

    } else {
      tipe = ''
    }
    let lokasi_id = (this.penerimaanTbsRincianForm.controls['lokasi'].value != null) ? this.penerimaanTbsRincianForm.controls['lokasi'].value['id'] : null;
    let data = {
      tipe: tipe,
      mill_id: lokasi_id,
      tipe_laporan:tipe_laporan,
      tgl_mulai: formatDate(this.penerimaanTbsRincianForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.penerimaanTbsRincianForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.PksTimbanganService.getLaporanPenerimaanTbsRincian(data).subscribe((res: any) => {
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_report.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

  reportPenerimaanTbsRincianInt(tipe_laporan) {
    this.isFormPenerimaanTbsRincianIntSubmitted = true;
    if (this.penerimaanTbsRincianIntForm.invalid) {
      return;
    }

    let data = {
      tipe_laporan: tipe_laporan,
      tgl_mulai: formatDate(this.penerimaanTbsRincianIntForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.penerimaanTbsRincianIntForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.PksTimbanganService.getLaporanPenerimaanTbsRincianInt(data).subscribe((res: any) => {
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_ext.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });
  }

  reportPenerimaanTbsRincianExt(tipe_laporan) {
    this.isFormPenerimaanTbsRincianExtSubmitted = true;
    if (this.penerimaanTbsRincianExtForm.invalid) {
      return;
    }

    let lokasi_id = (this.penerimaanTbsRincianExtForm.controls['lokasi'].value != null) ? this.penerimaanTbsRincianExtForm.controls['lokasi'].value['id'] : null;
    let supplier_id = (this.penerimaanTbsRincianExtForm.controls['supplier'].value != null) ? this.penerimaanTbsRincianExtForm.controls['supplier'].value['id'] : null;
    let data = {
      tipe_laporan: tipe_laporan,
      mill_id: lokasi_id,
      supplier_id: supplier_id,
      tgl_mulai: formatDate(this.penerimaanTbsRincianExtForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.penerimaanTbsRincianExtForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.PksTimbanganService.getLaporanPenerimaanTbsRincianExt(data).subscribe((res: any) => {
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_ext.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });
  }

  reportPenerimaanTbsRekap(tipe_laporan) {
    this.isFormPenerimaanTbsRekapSubmitted = true;
    if (this.penerimaanTbsRekapForm.invalid) {
      return;
    }

    // let lokasi_id = (this.penerimaanTbsRekapForm.controls['lokasi'].value!=null)?this.penerimaanTbsRekapForm.controls['lokasi'].value['id']:null ;
    // let supplier_id = (this.penerimaanTbsRekapForm.controls['supplier'].value!=null)?this.penerimaanTbsRekapForm.controls['supplier'].value['id']:null ;
    let data = {
      tipe_laporan:tipe_laporan,
      //  mill_id: lokasi_id,
      //  supplier_id: supplier_id,
      // tgl_mulai: formatDate(this.penerimaanTbsRekapForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      // tgl_akhir: formatDate(this.penerimaanTbsRekapForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      tanggal: formatDate(this.penerimaanTbsRekapForm.controls['tanggal'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.PksTimbanganService.getLaporanPenerimaanTbsRekap(data).subscribe((res: any) => {
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_rekap.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });
  }


}
