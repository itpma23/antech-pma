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
import { AccJurnalService } from 'src/app/shared/services/acc_jurnal.service';
import { isNullOrUndefined } from 'util';
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
  isFormSubmitted=false;
  isFormSubmitted2=false;
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


  CashflowForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKategori;
  dataSelectAkun;
  dataSelectLokasi;




  bsModalRef: BsModalRef;
  dataSelectLokasi2: any[];
  dataSelectKategoris: any;
  dataSelectBulan: { id: string; text: string; }[];
  dataSelectTahun: { id: string; text: string; }[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private AccAkunService: AccAkunService,
    private gbmOrganisasiService :GbmOrganisasiService,
    private accJurnalService :AccJurnalService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.CashflowForm = this.builder.group({

      // kategori: new FormControl([],),
      // lokasi: new FormControl([],Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      bulan: new FormControl([], Validators.required),
      tahun: new FormControl([], Validators.required),
      // tanggal_mulai: new FormControl(toDate, Validators.required),
      // tanggal_akhir: new FormControl(toDate, Validators.required),

    });

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
    // this.kategoriService.getAll().subscribe(x => {
    //   console.log(x)
    //   this.dataSelectKategoris = [];
    //   let d=x['data'];
    //   d.forEach(d => {
    //     this.dataSelectKategoris.push({ "id": d.id, "text": d.nama });

    //   });

    // });
    // this.AccAkunService.getAllKasbank().subscribe(x => {
    //   this.dataSelectAkun = [];
    //   let a = x['data'];
    //   a.forEach(d => {
    //     this.dataSelectAkun.push({ "id": d.id, "text": d.nama +"("+d.kode +")"  });

    //   });

    // });

    // this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
    //   this.dataSelectLokasi = [];
    //   // let g=x['data'];
    //   x.forEach(d => {
    //     this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

    //   });

    // });
    // this.gbmOrganisasiService.getAllByType('lokasi').subscribe(x => {
    //   this.dataSelectLokasi2 = [];
    //   // let g=x['data'];
    //   x.forEach(d => {
    //     this.dataSelectLokasi2.push({ "id": d.id, "text": d.nama });

    //   });

    // });

  }

  reportCashflow() {
    this.isFormSubmitted2 = true;
    if (this.CashflowForm.invalid) {
      return;
    }

    let dataSubmit;

    // let kategori_id;
    // if (isNullOrUndefined(this.UangMukaRekapForm.get('kategori').value) != true) {
    //   if (isNullOrUndefined(this.UangMukaRekapForm.get('kategori').value!.id)) {
    //     kategori_id = null
    //   } else {
    //     kategori_id = this.UangMukaRekapForm.get('kategori').value.id;
    //   }

    // } else {
    //   kategori_id = null
    // }

    //  let lokasi_id = this.CashflowForm.controls['lokasi'].value['id'] ? this.CashflowForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.CashflowForm.controls['format_laporan'].value;
    let bulan = this.CashflowForm.controls['bulan'].value;
    let tahun = this.CashflowForm.controls['tahun'].value;
    let periode = this.CashflowForm.controls['tahun'].value.id + '-' + this.CashflowForm.controls['bulan'].value.id;

    dataSubmit = {
      // 'lokasi_id': lokasi_id,
      // 'tgl_mulai': formatDate(this.CashflowForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      // 'tgl_akhir': formatDate(this.CashflowForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,
      'periode':periode

    };
     console.log(dataSubmit);
    this.accJurnalService.getLaporanCashflow(dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'cashflow.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });

  }


}
