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
  isFormSubmitted = false;
  isFormSubmitted2 = false;
  isFormSubmitted3 = false;
  isFormSubmitted4 = false;
  isFormSubmitted5 = false;
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

  BukuBesarForm: FormGroup;
  NeracaSaldoForm: FormGroup;
  NeracaSaldoAllUnitForm: FormGroup;
  JurnalForm: FormGroup;
  NeracaForm: FormGroup;
  LabaRugiForm: FormGroup;
  event: EventEmitter<any> = new EventEmitter();
  @ViewChild(DataTableDirective, { static: false })


  dataSelectKategori;
  dataSelectAkun;
  dataSelectLokasi;




  bsModalRef: BsModalRef;
  dataSelectLokasi2: any[];
  dataSelectKategoris: any;
  EquitasForm: FormGroup;
  NeracaSaldoMutasiForm: FormGroup;
  ExportJurnalForm: FormGroup;


  constructor(private http: HttpClient, private authenticationService: AuthenticationService,
    private bsModalService: BsModalService, private exportAsService: ExportAsService,


    private translate: TranslateService,
    private AccAkunService: AccAkunService,
    private gbmOrganisasiService: GbmOrganisasiService,
    private accJurnalService: AccJurnalService,
    private builder: FormBuilder) {
    let toDate: Date = new Date();
    this.NeracaForm = this.builder.group({
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      versi_laporan: new FormControl('v1', Validators.required),
      tipe_laporan: new FormControl('v1', Validators.required),
    });
    this.EquitasForm = this.builder.group({
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
    });
    this.NeracaSaldoForm = this.builder.group({

      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      akun_dari: new FormControl([], Validators.required),
      akun_sampai: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      // versi_laporan: new FormControl('v1', Validators.required),

    });
    this.NeracaSaldoMutasiForm = this.builder.group({

      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      akun_dari: new FormControl([], Validators.required),
      akun_sampai: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      tipe_laporan: new FormControl('v1', Validators.required),

    });
    this.LabaRugiForm = this.builder.group({

      lokasi: new FormControl([]),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      versi_laporan: new FormControl('v1', Validators.required),
      tipe_laporan: new FormControl('v1', Validators.required),
      is_include_jurnal_reclass:new FormControl(false, Validators.required),

    });
    this.NeracaSaldoAllUnitForm = this.builder.group({
      tanggal_akhir: new FormControl(toDate, Validators.required),
      akun_dari: new FormControl([], Validators.required),
      akun_sampai: new FormControl([], Validators.required),
      format_laporan: new FormControl('view', Validators.required),
      versi_laporan: new FormControl('v1', Validators.required),
      tipe_laporan: new FormControl('v1', Validators.required),

    });
    this.BukuBesarForm = this.builder.group({
      lokasi: new FormControl([],),
      // akun: new FormControl([], Validators.required),
      akun_dari: new FormControl([], Validators.required),
      akun_sampai: new FormControl([], Validators.required),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),


    });
    this.JurnalForm = this.builder.group({
      lokasi: new FormControl([], Validators.required),
      akun_dari: new FormControl([], Validators.required),
      akun_sampai: new FormControl([], Validators.required),
      no_jurnal: new FormControl(''),
      no_ref: new FormControl(''),
      ket: new FormControl(''),
      tanggal_mulai: new FormControl(toDate, Validators.required),
      tanggal_akhir: new FormControl(toDate, Validators.required),
      format_laporan: new FormControl('view', Validators.required),

    });
    this.ExportJurnalForm = this.builder.group({
      lokasi: new FormControl([]),
      
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
    this.AccAkunService.getAllDetail().subscribe(x => {
      this.dataSelectAkun = [];
      let a = x['data'];
      a.forEach(d => {
        this.dataSelectAkun.push({ "id": d.id, "text": d.kode + ' - ' + d.nama });

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

  reportNeracaSaldo() {
    this.isFormSubmitted2 = true;
    if (this.NeracaSaldoForm.invalid) {
      return;
    }

    let dataSubmit;

    // let kategori_id;
    // if (isNullOrUndefined(this.NeracaSaldoForm.get('kategori').value) != true) {
    //   if (isNullOrUndefined(this.NeracaSaldoForm.get('kategori').value!.id)) {
    //     kategori_id = null
    //   } else {
    //     kategori_id = this.NeracaSaldoForm.get('kategori').value.id;
    //   }

    // } else {
    //   kategori_id = null
    // }

    //  let lokasi_id = this.NeracaSaldoForm.controls['lokasi'].value['id'] ? this.NeracaSaldoForm.controls['lokasi'].value['id'] : null;
    let lokasi_id = (this.NeracaSaldoForm.controls['lokasi'].value != null) ? this.NeracaSaldoForm.controls['lokasi'].value['id'] : null;
    let akun_dari = this.NeracaSaldoForm.controls['akun_dari'].value['id'] ? this.NeracaSaldoForm.controls['akun_dari'].value['id'] : null;
    let akun_sampai = this.NeracaSaldoForm.controls['akun_sampai'].value['id'] ? this.NeracaSaldoForm.controls['akun_sampai'].value['id'] : null;
    let format_laporan = this.NeracaSaldoForm.controls['format_laporan'].value;
    // let versi_laporan = this.NeracaSaldoForm.controls['versi_laporan'].value;

    dataSubmit = {
      'lokasi_id': lokasi_id,
      'tgl_mulai': formatDate(this.NeracaSaldoForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.NeracaSaldoForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'akun_sampai': akun_sampai,
      'akun_dari': akun_dari,
      'format_laporan': format_laporan,
      // 'versi_laporan': versi_laporan,


    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanNeracaSaldo(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'neraca_saldo.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportNeracaSaldoMutasi() {
    this.isFormSubmitted5 = true;
    if (this.NeracaSaldoMutasiForm.invalid) {
      return;
    }

    let dataSubmit;

    // let kategori_id;
    // if (isNullOrUndefined(this.NeracaSaldoForm.get('kategori').value) != true) {
    //   if (isNullOrUndefined(this.NeracaSaldoForm.get('kategori').value!.id)) {
    //     kategori_id = null
    //   } else {
    //     kategori_id = this.NeracaSaldoForm.get('kategori').value.id;
    //   }

    // } else {
    //   kategori_id = null
    // }

    //  let lokasi_id = this.NeracaSaldoForm.controls['lokasi'].value['id'] ? this.NeracaSaldoForm.controls['lokasi'].value['id'] : null;
    // let lokasi_id = (this.NeracaSaldoForm.controls['lokasi'].value != null) ? this.NeracaSaldoForm.controls['lokasi'].value['id'] : null;
    let akun_dari = this.NeracaSaldoMutasiForm.controls['akun_dari'].value['id'] ? this.NeracaSaldoMutasiForm.controls['akun_dari'].value['id'] : null;
    let akun_sampai = this.NeracaSaldoMutasiForm.controls['akun_sampai'].value['id'] ? this.NeracaSaldoMutasiForm.controls['akun_sampai'].value['id'] : null;
    let format_laporan = this.NeracaSaldoMutasiForm.controls['format_laporan'].value;
    let tipe_laporan = this.NeracaSaldoMutasiForm.controls['tipe_laporan'].value;

    dataSubmit = {
      // 'lokasi_id': lokasi_id,
      'tgl_mulai': formatDate(this.NeracaSaldoMutasiForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.NeracaSaldoMutasiForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'akun_sampai': akun_sampai,
      'akun_dari': akun_dari,
      'format_laporan': format_laporan,
      'versi_laporan': tipe_laporan,


    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanNeracaSaldoMutasi(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'neraca_saldo.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportNeracaSaldoAllUnit() {
    this.isFormSubmitted3 = true;
    if (this.NeracaSaldoAllUnitForm.invalid) {
      return;
    }

    let dataSubmit;

    // let kategori_id;
    // if (isNullOrUndefined(this.NeracaSaldoForm.get('kategori').value) != true) {
    //   if (isNullOrUndefined(this.NeracaSaldoForm.get('kategori').value!.id)) {
    //     kategori_id = null
    //   } else {
    //     kategori_id = this.NeracaSaldoForm.get('kategori').value.id;
    //   }

    // } else {
    //   kategori_id = null
    // }

    let versi_laporan = this.NeracaSaldoAllUnitForm.controls['versi_laporan'].value;
    let akun_dari = this.NeracaSaldoAllUnitForm.controls['akun_dari'].value['id'] ? this.NeracaSaldoAllUnitForm.controls['akun_dari'].value['id'] : null;
    let akun_sampai = this.NeracaSaldoAllUnitForm.controls['akun_sampai'].value['id'] ? this.NeracaSaldoAllUnitForm.controls['akun_sampai'].value['id'] : null;
    let format_laporan = this.NeracaSaldoAllUnitForm.controls['format_laporan'].value;

    dataSubmit = {
      'tgl_akhir': formatDate(this.NeracaSaldoAllUnitForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'akun_sampai': akun_sampai,
      'akun_dari': akun_dari,
      'format_laporan': format_laporan,
      'versi_laporan': versi_laporan,

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanNeracaSaldoAllUnit(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'neraca_saldo_all_unit.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportNeraca() {
    this.isFormSubmitted4 = true;
    if (this.NeracaForm.invalid) {
      return;
    }

    let dataSubmit;
    let format_laporan = this.NeracaForm.controls['format_laporan'].value;
    let versi_laporan = this.NeracaForm.controls['versi_laporan'].value;
    let tipe_laporan = this.NeracaForm.controls['tipe_laporan'].value;
    dataSubmit = {
      'tgl_akhir': formatDate(this.NeracaForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,
      'versi_laporan': versi_laporan,
      'tipe_laporan': tipe_laporan,
    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanNeraca(dataSubmit).subscribe((res: any) => {
      //console.log(res);

      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'neraca.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportLabaRugi() {
    this.isFormSubmitted = true;
    if (this.LabaRugiForm.invalid) {
      return;
    }

    let dataSubmit;


    // let lokasi_id;
    // if (isNullOrUndefined(this.LabaRugiForm.get('lokasi').value) != true) {
    //   if (isNullOrUndefined(this.LabaRugiForm.get('lokasi').value!.id)) {
    //     lokasi_id = null
    //   } else {
    //     lokasi_id = this.LabaRugiForm.get('lokasi').value.id;
    //   }

    // } else {
    //   lokasi_id = null
    // }


    let tipe_laporan = this.LabaRugiForm.controls['tipe_laporan'].value;
    let format_laporan = this.LabaRugiForm.controls['format_laporan'].value;
    let versi_laporan = this.LabaRugiForm.controls['versi_laporan'].value;
    let is_include_jurnal_reclass = this.LabaRugiForm.controls['is_include_jurnal_reclass'].value;
    dataSubmit = {
      // 'lokasi_id': lokasi_id,
      'tgl_mulai': formatDate(this.LabaRugiForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.LabaRugiForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,
      'versi_laporan': versi_laporan,
      'tipe_laporan': tipe_laporan,
      'is_include_jurnal_reclass':is_include_jurnal_reclass

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanLabaRugi(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'labarugi.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportBukuBesar() {
    this.isFormSubmitted = true;
    if (this.BukuBesarForm.invalid) {
      return;
    }

    let dataSubmit;



    // let akun_id = this.BukuBesarForm.controls['akun'].value['id'] ? this.BukuBesarForm.controls['akun'].value['id'] : null;
    // let lokasi_id = this.BukuBesarForm.controls['lokasi']!.value['id'] ? this.BukuBesarForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.BukuBesarForm.controls['format_laporan'].value;
    let akun_dari = this.BukuBesarForm.controls['akun_dari'].value['id'] ? this.BukuBesarForm.controls['akun_dari'].value['id'] : null;
    let akun_sampai = this.BukuBesarForm.controls['akun_sampai'].value['id'] ? this.BukuBesarForm.controls['akun_sampai'].value['id'] : null;

     let lokasi_id;
    if (isNullOrUndefined(this.BukuBesarForm.get('lokasi').value) != true) {
      if (isNullOrUndefined(this.BukuBesarForm.get('lokasi').value!.id)) {
        lokasi_id = null
      } else {
        lokasi_id = this.BukuBesarForm.get('lokasi').value.id;
      }

    } else {
      lokasi_id = null
    }

    dataSubmit = {
      'lokasi_id': lokasi_id,
      // 'akun_id': akun_id,
      'akun_sampai': akun_sampai,
      'akun_dari': akun_dari,
      'tgl_mulai': formatDate(this.BukuBesarForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.BukuBesarForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanBukuBesar(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'buku_besar.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  reportJurnal() {
    this.isFormSubmitted = true;
    if (this.JurnalForm.invalid) {
      return;
    }

    let dataSubmit;



    let akun_dari = this.JurnalForm.controls['akun_dari'].value['id'] ? this.JurnalForm.controls['akun_dari'].value['id'] : null;
    let akun_sampai = this.JurnalForm.controls['akun_sampai'].value['id'] ? this.JurnalForm.controls['akun_sampai'].value['id'] : null;
    let lokasi_id = this.JurnalForm.controls['lokasi'].value['id'] ? this.JurnalForm.controls['lokasi'].value['id'] : null;
    let format_laporan = this.JurnalForm.controls['format_laporan'].value;

    dataSubmit = {
      'lokasi_id': lokasi_id,
      'akun_sampai': akun_sampai,
      'akun_dari': akun_dari,
      'no_jurnal': this.JurnalForm.controls['no_jurnal'].value,
      'no_ref': this.JurnalForm.controls['no_ref'].value,
      'ket': this.JurnalForm.controls['ket'].value,
      'tgl_mulai': formatDate(this.JurnalForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.JurnalForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,

    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanJurnal(dataSubmit).subscribe((res: any) => {
      //console.log(res);
      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'jurnal.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
  ExportJurnal() {
    this.isFormSubmitted = true;
    if (this.ExportJurnalForm.invalid) {
      return;
    }

    let dataSubmit;



     let lokasi_id = this.ExportJurnalForm.controls['lokasi'].value['id'] ? this.ExportJurnalForm.controls['lokasi'].value['id'] : null;
   
    dataSubmit = {
      'lokasi_id': lokasi_id,
     
      
      'tgl_mulai': formatDate(this.ExportJurnalForm.controls['tanggal_mulai'].value, "yyyy-MM-dd", 'en_US'),
      'tgl_akhir': formatDate(this.ExportJurnalForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),


    };
    console.log(dataSubmit);
    this.accJurnalService.getExportJurnal(dataSubmit).subscribe((res: any) => {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'jurnal.csv') 

    });

  }
  reportEquitas() {
    this.isFormSubmitted4 = true;
    if (this.EquitasForm.invalid) {
      return;
    }

    let dataSubmit;
    let format_laporan = this.EquitasForm.controls['format_laporan'].value;
    dataSubmit = {
      'tgl_akhir': formatDate(this.EquitasForm.controls['tanggal_akhir'].value, "yyyy-MM-dd", 'en_US'),
      'format_laporan': format_laporan,
    };
    console.log(dataSubmit);
    this.accJurnalService.getLaporanEquitas(dataSubmit).subscribe((res: any) => {
      //console.log(res);

      if (format_laporan == 'xls') {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel' })
        saveAs(blob, 'neraca.xls')

      } else {
        var fileURL = URL.createObjectURL(res);
        window.open(fileURL);
      }

    });

  }
}
