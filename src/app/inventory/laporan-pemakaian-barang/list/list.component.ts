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
import { InvPemakaianBarangService } from 'src/app/shared/services/inv_pemakaian_barang.service';
import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { InvKategoriService } from 'src/app/shared/services/inv_kategori.service';
import { AccKegiatanService } from 'src/app/shared/services/acc_kegiatan.service';
import { TrkKendaraanService } from 'src/app/shared/services/trk_kendaraan.service';
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


  formRincianPemakaian: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKegiatan;
  dataSelectOrganisasi;
  dataSelectItem;
  dataSelectGudang;
  dataSelectBlok;
  dataSelectTraksi;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];
  dataTipe: { id: string; text: string; }[];
  dataSelectTipe: { id: string; text: string; }[];
  frmPemakaianByTanggal: FormGroup;
  dataSelectKategoriItem: any[];
  dataSelectGudang2: any[];


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private GbmOrganisasiService: GbmOrganisasiService,
    private invItemService: InvItemService,
    private invPemakaianBarangService: InvPemakaianBarangService,
    private invKategoriService: InvKategoriService,
    private accKegiatanService: AccKegiatanService,
    private trkKendaraanService: TrkKendaraanService,

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


    this.formRincianPemakaian = this.builder.group({
      lokasi: new FormControl([]),
      gudang: new FormControl([]),
      blok: new FormControl([]),
      traksi: new FormControl([]),
      item: new FormControl([]),
      kegiatan: new FormControl([]),
      keterangan: new FormControl(''),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });

    this.frmPemakaianByTanggal = this.builder.group({
      lokasi: new FormControl([]),
      gudang: new FormControl([]),
      kategori_item: new FormControl([]),
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

    this.invItemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.kode + ' - ' + d.nama + "(" + d.uom + ")" });
      });
    });
    this.invKategoriService.getAll().subscribe(x => {
      this.dataSelectKategoriItem = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKategoriItem.push({ "id": d.id, "text":d.nama  });
      });
    });
    this.accKegiatanService.getAllbyTipe('BAHAN').subscribe(x => {
      this.dataSelectKegiatan = [];
      let i = x['data'];
      i.forEach(d => {
        this.dataSelectKegiatan.push({ "id": d.id, "text": d.nama });
      });
    });


    this.GbmOrganisasiService.getAllByType("UNIT").subscribe(x => {
      this.dataSelectOrganisasi = [];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({ "id": d.id, "text": d.nama });
      });

      this.formRincianPemakaian.controls['lokasi'].valueChanges.subscribe(x => {
        let org_id = x.id;

        this.GbmOrganisasiService.getGudangByUnit(org_id).subscribe(x => {

          this.dataSelectGudang = [];
          x.forEach(d => {
            this.dataSelectGudang.push({ "id": d.id, "text": d.nama });
          });
        });
      });

      this.formRincianPemakaian.controls['lokasi'].valueChanges.subscribe(x => {
        let org_id = x.id;
        this.GbmOrganisasiService.getMesinBlokByMillEstate(org_id).subscribe(x => {
          this.dataSelectBlok = [];
          x.forEach(d => {
            this.dataSelectBlok.push({ "id": d.id, "text": d.kode + ' - ' + d.nama  });
          });
        });
      });
      this.frmPemakaianByTanggal.controls['lokasi'].valueChanges.subscribe(x => {
        let org_id = x.id;
        console.log(x)
        this.GbmOrganisasiService.getGudangByUnit(org_id).subscribe(x => {
          console.log(x)
          this.dataSelectGudang2 = [];
          x.forEach(d => {
            this.dataSelectGudang2.push({ "id": d.id, "text": d.nama });
          });
        });
      });


    });

    this.trkKendaraanService.getAll().subscribe(x => {
      this.dataSelectTraksi = [];
      x['data'].forEach(d => {
        this.dataSelectTraksi.push({ "id": d.id, "text":d.kode+'-'+ d.nama });
      });
    });


  }

  reportRincianPemakaian(tipe_laporan) {
    this.isFormRincianPoSubmitted = true;
    if (this.formRincianPemakaian.invalid) {
      return;
    }

    let lokasi_id = (this.formRincianPemakaian.controls['lokasi'].value != null) ? this.formRincianPemakaian.controls['lokasi'].value['id'] : null;
    let gudang_id = (this.formRincianPemakaian.controls['gudang'].value != null) ? this.formRincianPemakaian.controls['gudang'].value['id'] : null;
    let item_id = (this.formRincianPemakaian.controls['item'].value != null) ? this.formRincianPemakaian.controls['item'].value['id'] : null;
    let kegiatan_id = (this.formRincianPemakaian.controls['kegiatan'].value != null) ? this.formRincianPemakaian.controls['kegiatan'].value['id'] : null;
    let blok_id = (this.formRincianPemakaian.controls['blok'].value != null) ? this.formRincianPemakaian.controls['blok'].value['id'] : null;
    let traksi_id = (this.formRincianPemakaian.controls['traksi'].value != null) ? this.formRincianPemakaian.controls['traksi'].value['id'] : null;

    let ket = (this.formRincianPemakaian.controls['keterangan'].value != null) ? this.formRincianPemakaian.controls['keterangan'].value : null;


    let format_laporan=this.formRincianPemakaian.controls['format_laporan'].value;
    let data = {
      format_laporan: format_laporan,
      tipe_laporan: tipe_laporan,
      ket: ket,
      lokasi_id: lokasi_id,
      gudang_id: gudang_id,
      blok_id: blok_id,
      traksi_id: traksi_id,
      item_id: item_id,
      kegiatan_id: kegiatan_id,
      tgl_mulai: formatDate(this.formRincianPemakaian.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.formRincianPemakaian.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.invPemakaianBarangService.getPemakaianReportDetail(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rincian_pemakaian_po.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }

  reportPemakaianByTanggal(tipe_laporan) {
    this.isFormRincianPoSubmitted = true;
    if (this.formRincianPemakaian.invalid) {
      return;
    }

    let lokasi_id = (this.frmPemakaianByTanggal.controls['lokasi'].value != null) ? this.frmPemakaianByTanggal.controls['lokasi'].value['id'] : null;
    let gudang_id = (this.frmPemakaianByTanggal.controls['gudang'].value != null) ? this.frmPemakaianByTanggal.controls['gudang'].value['id'] : null;
    let kategori_item_id = (this.frmPemakaianByTanggal.controls['kategori_item'].value != null) ? this.frmPemakaianByTanggal.controls['kategori_item'].value['id'] : null;


    let format_laporan=this.frmPemakaianByTanggal.controls['format_laporan'].value;
    let data = {
      format_laporan: format_laporan,
      tipe_laporan: tipe_laporan,
      lokasi_id: lokasi_id,
      gudang_id: gudang_id,
      kategori_item_id: kategori_item_id,
      tgl_mulai: formatDate(this.frmPemakaianByTanggal.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.frmPemakaianByTanggal.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.invPemakaianBarangService.getPemakaianReportByTanggal(data).subscribe((res: any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'rincian_pemakaian_po.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }


}
