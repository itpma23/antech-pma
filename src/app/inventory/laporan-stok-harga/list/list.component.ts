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

import { InvItemService } from 'src/app/shared/services/inv_item.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { InvKategoriService } from 'src/app/shared/services/inv_kategori.service';
import { InvLaporanService } from 'src/app/shared/services/inv_laporan.service';
import { isNullOrUndefined } from 'util';
declare var swal: any;

declare var $: any;
import { saveAs } from 'file-saver';

@Component({
  moduleId: module.id,
  selector: 'list-cmp',
  templateUrl: 'list.component.html',
  styleUrls: ['list.css'],
})

export class ListComponent implements OnInit {
  isFormSubmitted=false;
  isFormSubmitted2=false;
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

  kartuStokForm: FormGroup;
  rekapStokForm: FormGroup;
  pemakaianForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKategori;
  dataSelectItem;
  dataSelectGudang;




  bsModalRef: BsModalRef;
  dataSelectGudang2: any[];
  dataSelectKategoris: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private itemService: InvItemService,
    private gbmOrganisasiService :GbmOrganisasiService,
    private kategoriService :InvKategoriService,
    private invLaporanService :InvLaporanService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.rekapStokForm = this.builder.group({
      kategori: new FormControl([],),
      gudang: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tampil_stok_nol:new FormControl(false, Validators.required),
    });
    this.pemakaianForm = this.builder.group({
      kategori: new FormControl([],),
      gudang: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.kartuStokForm = this.builder.group({
      gudang: new FormControl([]),
      item: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
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
    this.exportAsService.save(this.exportAsConfig, 'stok').subscribe(() => { });
  }
  private loadSelect2(): void {
    this.kategoriService.getAll().subscribe(x => {
      console.log(x)
      this.dataSelectKategoris = [];
      let d=x['data'];
      d.forEach(d => {
        this.dataSelectKategoris.push({ "id": d.id, "text": d.nama });

      });

    });
    this.itemService.getAll().subscribe(x => {
      this.dataSelectItem = [];
      let a = x['data'];
      a.forEach(d => {
        this.dataSelectItem.push({ "id": d.id, "text": d.nama +"("+d.kode +")"  });

      });

    });

    this.gbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectGudang = [];
      // let g=x['data'];
      x.forEach(d => {
        this.dataSelectGudang.push({ "id": d.id, "text": d.nama });

      });

    });
    this.gbmOrganisasiService.getAllGudangCentralAndVirtual().subscribe(x => {
      this.dataSelectGudang2 = [];
      // let g=x['data'];
      x.forEach(d => {
        this.dataSelectGudang2.push({ "id": d.id, "text": d.nama });

      });

    });

  }

  reportRekapStok() {
    this.isFormSubmitted2 = true;
    if (this.rekapStokForm.invalid) {
      return;
    }

    let dataSubmit;

    let kategori_id;
    if (isNullOrUndefined(this.rekapStokForm.get('kategori').value) != true) {
      if (isNullOrUndefined(this.rekapStokForm.get('kategori').value!.id)) {
        kategori_id = null
      } else {
        kategori_id = this.rekapStokForm.get('kategori').value.id;
      }

    } else {
      kategori_id = null
    }

    //let kategori_id = this.rekapStokForm.controls['kategori'].value['id'] ? this.rekapStokForm.controls['kategori'].value['id'] : null;
    let gudang_id = this.rekapStokForm.controls['gudang'].value['id'] ? this.rekapStokForm.controls['gudang'].value['id'] : null;
    let format_laporan=this.rekapStokForm.controls['format_laporan'].value;
    let tampil_stok_nol=this.rekapStokForm.controls['tampil_stok_nol'].value;
    dataSubmit = {
      'format_laporan': format_laporan,
      'gudang_id': gudang_id,
      'kategori_id': kategori_id,
      'tgl_mulai': formatDate(this.rekapStokForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.rekapStokForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'tampil_stok_nol':tampil_stok_nol


    };
     console.log(dataSubmit);
    this.invLaporanService.getLaporanRekapSaldoHarga(dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'stok.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }


    });

  }
  reportKartuStok() {
    this.isFormSubmitted = true;
    if (this.kartuStokForm.invalid) {
      return;
    }

    let dataSubmit;



    let item_id = this.kartuStokForm.controls['item'].value['id'] ? this.kartuStokForm.controls['item'].value['id'] : null;
    let gudang_id = this.kartuStokForm.controls['gudang'].value['id'] ? this.kartuStokForm.controls['gudang'].value['id'] : null;
    let format_laporan=this.kartuStokForm.controls['format_laporan'].value;
    dataSubmit = {
      'format_laporan': format_laporan,
      'gudang_id': gudang_id,
      'item_id': item_id,
      'tgl_mulai': formatDate(this.kartuStokForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.kartuStokForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };
     console.log(dataSubmit);
    this.invLaporanService.getLaporanKartuStokHarga(dataSubmit).subscribe((res:any) => {

      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'stok.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportPemakaian() {
    this.isFormSubmitted2 = true;
    if (this.pemakaianForm.invalid) {
      return;
    }

    let dataSubmit;

    let kategori_id;
    if (isNullOrUndefined(this.pemakaianForm.get('kategori').value) != true) {
      if (isNullOrUndefined(this.pemakaianForm.get('kategori').value!.id)) {
        kategori_id = null
      } else {
        kategori_id = this.pemakaianForm.get('kategori').value.id;
      }

    } else {
      kategori_id = null
    }

    //let kategori_id = this.rekapStokForm.controls['kategori'].value['id'] ? this.rekapStokForm.controls['kategori'].value['id'] : null;
    let gudang_id = this.pemakaianForm.controls['gudang'].value['id'] ? this.pemakaianForm.controls['gudang'].value['id'] : null;
    let format_laporan=this.pemakaianForm.controls['format_laporan'].value;
    dataSubmit = {
      'format_laporan': format_laporan,
      'gudang_id': gudang_id,
      'kategori_id': kategori_id,
      'tgl_mulai': formatDate(this.pemakaianForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.pemakaianForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),

    };
     console.log(dataSubmit);
    this.invLaporanService.getLaporanPemakaianHarga(dataSubmit).subscribe((res:any) => {
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'stok.xls')
      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }


    });

  }

}
