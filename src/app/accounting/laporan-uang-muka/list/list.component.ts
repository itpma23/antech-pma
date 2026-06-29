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
import { AccUangMukaService } from 'src/app/shared/services/acc_uang_muka.service';
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

  UangMukaRekapDetailForm: FormGroup;
  UangMukaRekapForm: FormGroup;

  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKategori;
  dataSelectAkun;
  dataSelectLokasi;




  bsModalRef: BsModalRef;
  dataSelectLokasi2: any[];
  dataSelectKategoris: any;

  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private AccAkunService: AccAkunService,
    private gbmOrganisasiService :GbmOrganisasiService,
    private accUangMukaService :AccUangMukaService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();

    this.UangMukaRekapForm = this.builder.group({

      // kategori: new FormControl([],),
      lokasi: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

    });
    this.UangMukaRekapDetailForm = this.builder.group({
      lokasi: new FormControl([],Validators.required),
      akun: new FormControl([],Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),

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
    // this.kategoriService.getAll().subscribe(x => {
    //   console.log(x)
    //   this.dataSelectKategoris = [];
    //   let d=x['data'];
    //   d.forEach(d => {
    //     this.dataSelectKategoris.push({ "id": d.id, "text": d.nama });

    //   });

    // });
    this.AccAkunService.getAllKasbank().subscribe(x => {
      this.dataSelectAkun = [];
      let a = x['data'];
      a.forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.nama +"("+d.kode +")"  });

      });

    });

    this.gbmOrganisasiService.getAllAdmUnitByAccess().subscribe(x => {
      this.dataSelectLokasi = [];
      // let g=x['data'];
      x.forEach(d => {
        this.dataSelectLokasi.push({ "id": d.id, "text": d.nama });

      });

    });
    // this.gbmOrganisasiService.getAllByType('lokasi').subscribe(x => {
    //   this.dataSelectLokasi2 = [];
    //   // let g=x['data'];
    //   x.forEach(d => {
    //     this.dataSelectLokasi2.push({ "id": d.id, "text": d.nama });

    //   });

    // });

  }

  reportSaldo() {
    this.isFormSubmitted2 = true;
    if (this.UangMukaRekapForm.invalid) {
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

     let lokasi_id = this.UangMukaRekapForm.controls['lokasi'].value['id'] ? this.UangMukaRekapForm.controls['lokasi'].value['id'] : null;

    dataSubmit = {
      'lokasi_id': lokasi_id,
      'tgl_mulai': formatDate(this.UangMukaRekapForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.UangMukaRekapForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),


    };
     console.log(dataSubmit);
    this.accUangMukaService.getLaporan(dataSubmit).subscribe((res:any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }
  reportSaldoDetail() {
    this.isFormSubmitted = true;
    if (this.UangMukaRekapDetailForm.invalid) {
      return;
    }

    let dataSubmit;



    let akun_id = this.UangMukaRekapDetailForm.controls['akun'].value['id'] ? this.UangMukaRekapDetailForm.controls['akun'].value['id'] : null;
    let lokasi_id = this.UangMukaRekapDetailForm.controls['lokasi'].value['id'] ? this.UangMukaRekapDetailForm.controls['lokasi'].value['id'] : null;

    dataSubmit = {
      'lokasi_id': lokasi_id,
      'akun_id': akun_id,
      'tgl_mulai': formatDate(this.UangMukaRekapDetailForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.UangMukaRekapDetailForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),


    };
     console.log(dataSubmit);
    this.accUangMukaService.getLaporanRinci(dataSubmit).subscribe((res:any) => {
      //console.log(res);
      var fileURL = URL.createObjectURL(res);
      window.open(fileURL);

    });

  }


}
