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
import { saveAs } from 'file-saver';
import { PksLaporanPengolahanService } from 'src/app/shared/services/pks_laporan_pengolahan.service';
import { GbmOrganisasiService } from 'src/app/shared/services/gbm_organisasi.service';
import { SlsKontrakService } from 'src/app/shared/services/sls_kontrak.service';
import { PksSjppService } from 'src/app/shared/services/pks_sjpp.service';
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
  isFormKaryawanSubmitted=false;
  isFormAbsensiSubmitted=false;
  isFormLemburSubmitted=false;
  isFormProduksiSubmitted=false;
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

  ProduksiForm: FormGroup;
  LaporanPengolahanForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })



  dataSelectKontrak;
  dataSelectOrganisasi;
  dataSelectProduk;


  bsModalRef: BsModalRef;
  dataSelectPeriode: any[];

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,

    private GbmOrganisasiService: GbmOrganisasiService,
    private pksLaporanPengolahanService: PksLaporanPengolahanService,
    private invItemService: InvItemService,

    private builder: FormBuilder) {
    let toDate: Date = new Date();



    this.ProduksiForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      tanggal: new FormControl(toDate, Validators.required),
    });
    this.LaporanPengolahanForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      // produk: new FormControl([], Validators.required),
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
    this.exportAsService.save(this.exportAsConfig, 'mapel').subscribe(() => { });
  }

  private loadSelect2(): void {

    this.invItemService.getAll().subscribe(x => {
      this.dataSelectProduk = [];
      x['data'].forEach(d => {
        this.dataSelectProduk.push({ "id": d.id, "text": d.nama });
      });
    });



    this.GbmOrganisasiService.getAllByType("MILL").subscribe(x=>{
      this.dataSelectOrganisasi=[];
      x.forEach(d => {
        this.dataSelectOrganisasi.push({"id":d.id,"text":d.nama});
        console.log(d.nama);
      });
    });

    // this.karyawanService.getAll().subscribe(x=>{
    //   this.dataSelectKaryawanAbsensi=[];
    //   this.dataSelectKaryawanLembur=[];
    //  let  peng=x['data'];
    //   peng.forEach(d => {
    //     this.dataSelectKaryawanAbsensi.push({"id":d.id,"text":d.nama});
    //     this.dataSelectKaryawanLembur.push({"id":d.id,"text":d.nama});

    //   });

    // });

    // this.dataSelectBulan=[
    //   { "id": "01", "text": "Januari" },
    //   { "id": "02", "text": "Februari" },
    //   { "id": "03", "text": "Maret" },
    //   { "id": "04", "text": "April" },
    //   { "id": "05", "text": "Mei" },
    //   { "id": "06", "text": "Juni" },
    //   { "id": "07", "text": "Juli" },
    //   { "id": "08", "text": "Agustus" },
    //   { "id": "09", "text": "September" },
    //   { "id": "10", "text": "Oktober" },
    //   { "id": "11", "text": "November" },
    //   { "id": "12", "text": "Desember" },
    // ];

    // this.dataSelectTahun=[
    //   { "id": "2020", "text": "2020" },
    //   { "id": "2021", "text": "2021" },
    //   { "id": "2022", "text": "2022" },
    //   { "id": "2023", "text": "2023" },
    //   { "id": "2024", "text": "2024" },
    //   { "id": "2025", "text": "2025" },
    // ];




  }





  reportProduksi() {
    this.isFormProduksiSubmitted = true;
    if (this.ProduksiForm.invalid) {
      return;
    }
    let produk_id = (this.LaporanPengolahanForm.controls['produk'].value!=null)?this.LaporanPengolahanForm.controls['produk'].value['id']:null ;
    let lokasi_id = (this.ProduksiForm.controls['lokasi'].value!=null)?this.ProduksiForm.controls['lokasi'].value['id']:null ;
    let data={
      lokasi_id: lokasi_id,
      produk_id: produk_id,
      tanggal: formatDate(this.ProduksiForm.controls['tanggal'].value, "yyyy-MM-dd", 'en_US'),
    };

    this.pksLaporanPengolahanService.getLaporanPengolahan(data).subscribe((res:any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);
    });

    console.log('submit');
  }



  reportLaporanPengolahan(tipe_laporan) {
    this.isFormProduksiSubmitted = true;
    if (this.LaporanPengolahanForm.invalid) {
      return;
    }
    // let produk_id = (this.LaporanPengolahanForm.controls['produk'].value!=null)?this.LaporanPengolahanForm.controls['produk'].value['id']:null ;

    let lokasi_id = (this.LaporanPengolahanForm.controls['lokasi'].value!=null)?this.LaporanPengolahanForm.controls['lokasi'].value['id']:null ;
    let data={
     lokasi_id: lokasi_id,
    //  produk_id: produk_id,
     tipe_laporan:tipe_laporan,
      tgl_mulai: formatDate(this.LaporanPengolahanForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      tgl_akhir: formatDate(this.LaporanPengolahanForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
    };

    console.log(data);
    this.pksLaporanPengolahanService.getLaporanPengolahan(data).subscribe((res:any) => {
      //console.log(res);
      if (tipe_laporan == 'excel') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'tbs_report.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }
    });
  }






}
