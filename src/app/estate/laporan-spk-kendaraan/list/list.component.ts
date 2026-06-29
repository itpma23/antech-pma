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
import { GbmSupplierService } from 'src/app/shared/services/gbm_supplier.service';
import { EstSpkKendaraanService } from 'src/app/shared/services/est_spk_kendaraan.service';
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
  isFormRincianSpkSubmitted = false;
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
  laporanRincianSpk: FormGroup;
  penerimaanTbsRekapForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectOrganisasi;
  dataSelectSupplier;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
     private gbmSupplierService: GbmSupplierService,
    private EstSpkService: EstSpkKendaraanService,

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


    this.laporanRincianSpk = this.builder.group({
      lokasi: new FormControl([]),
      supplier: new FormControl([]),
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
    this.exportAsService.save(this.exportAsConfig, 'exported').subscribe(() => { });
  }

  private loadSelect2(): void {




    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
      });

      // this.laporanRincianSpk.controls['lokasi'].valueChanges.subscribe(x => {
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

    this.gbmSupplierService.getKontraktor().subscribe(x => {
      this.dataSelectSupplier = [];
      x['data'].forEach(d => {
        this.dataSelectSupplier.push({ "id": d.id, "text": d.nama_supplier });
      });
    });


  }

  reportRincian(tipe_laporan) {
    this.isFormRincianSpkSubmitted = true;
    if (this.laporanRincianSpk.invalid) {
      return;
    }

    let lokasi_id = (this.laporanRincianSpk.controls['lokasi'].value != null) ? this.laporanRincianSpk.controls['lokasi'].value['id'] : null;
    let supplier_id = (this.laporanRincianSpk.controls['supplier'].value != null) ? this.laporanRincianSpk.controls['supplier'].value['id'] : null;
    let format_laporan = this.laporanRincianSpk.controls['format_laporan'].value
    let data = {
      tipe_laporan: tipe_laporan,
      format_laporan: format_laporan,
      lokasi_id: lokasi_id,
      supplier_id: supplier_id,
      tgl_mulai: formatDate(this.laporanRincianSpk.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.laporanRincianSpk.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.EstSpkService.getReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'skp_kendaraan.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }



}
